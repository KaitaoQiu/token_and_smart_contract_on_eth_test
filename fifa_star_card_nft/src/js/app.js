// require('dotenv').config();

App = {
  web3Provider: null,
  contracts: {},

//   init: function() {
//     // Load pets.
//     console.log("init, getting local json file");
//     $.getJSON('../cards.json', function(data) {
//       var petsRow = $('#cardsRow');
//       var petTemplate = $('#cardTemplate');

//       for (i = 0; i < data.length; i ++) {
//         petTemplate.find('.panel-title').text(data[i].name);
//         petTemplate.find('img').attr('src', data[i].picture);
//         petTemplate.find('.pet-breed').text(data[i].breed);
//         petTemplate.find('.pet-age').text(data[i].age);
//         petTemplate.find('.pet-location').text(data[i].location);
//         petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

//         petsRow.append(petTemplate.html());
//       }
//     });

//     return App.initWeb3();
//   },
    init: function () {
        $.getJSON('../pets.json', function (data) {
            var petsRow = $('#petsRow');
            var petTemplate = $('#petTemplate');

            for (i = 0; i < data.length; i++) {
                petTemplate.find('.panel-title').text(data[i].name);
                petTemplate.find('img').attr('src', data[i].picture);
                petTemplate.find('.country').text(data[i].country);
                petTemplate.find('.age').text(data[i].age);
                petTemplate.find('.current-team').text(data[i].current_team);
                petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

                petsRow.append(petTemplate.html());
            }
        });

        return App.initWeb3();
    },

    initWeb3: async function () {
        console.log("initWeb3");
        // Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;

        }
        // If no injected web3 instance is detected, fall back to Sephia
        else {
            // App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
            // webapi =
            // const infuraApiKey = process.env.INFURA_API_KEY;
            // const mnemonic = process.env.MNEMONIC;

            // var provider = process.env.INFURA_API_KEY;
            var provider = "https://sepolia.infura.io/v3/2d15ec56aa4b47cba10e7b44e5b79d2a"
            App.web3Provider = new Web3.providers.HttpProvider(provider);

        }
        web3 = new Web3(App.web3Provider);
        // web3.eth.getBlockNumber().then((result) => {
        //     console.log("Latest Ethereum block number: is", result);
        // });

        return App.initContract();
    },

    initContract: function () {
        // Load Adoption.json，Saved the ABI (Application Binary Interface) information of Adoption 
        // and the network (address) information after deployment. 
        // The ABI is generated during the contract compilation, and the network information is appended during the deployment.
        $.getJSON('Adoption.json', function (data) {
            // Using Adoption.json Data to create a contract abstraction
            var AdoptionArtifact = data;
            App.contracts.Adoption = TruffleContract(AdoptionArtifact);

            // Set the provider for our contract
            App.contracts.Adoption.setProvider(App.web3Provider);

            // Use our contract to retrieve and mark the adopted pets
            return App.markAdopted();
        });
        return App.bindEvents();
    },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },


    markAdopted: function (adopters, account) {
        var adoptionInstance;

        App.contracts.Adoption.deployed().then(function (instance) {
            adoptionInstance = instance;

            return adoptionInstance.getAdopters.call();
        }).then(function (adopters) {
            for (i = 0; i < adopters.length; i++) {
                if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
                    $('.panel-pet').eq(i).find('button').text('Own').attr('disabled', true);
                }
            }
        }).catch(function (err) {
            console.log(err.message);
        });
    },


    handleAdopt: function (event) {
        event.preventDefault();

        var petId = parseInt($(event.target).data('id'));

        var adoptionInstance;

        web3.eth.getAccounts(function (error, accounts) {
            if (error) {
                console.log(error);
            }

            var account = accounts[0];

            App.contracts.Adoption.deployed().then(function (instance) {
                adoptionInstance = instance;

                return adoptionInstance.adopt(petId, { from: account });
            }).then(function (result) {
                return App.markAdopted();
            }).catch(function (err) {
                console.log(err.message);
            });
        });
    }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
