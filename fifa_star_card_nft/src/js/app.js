App = {
  web3Provider: null,
  contracts: {},

    init: function () {
        $.getJSON('../cards.json', function (data) {
            var cardsRow = $('#cardsRow');
            var cardTemplate = $('#cardTemplate');

            for (i = 0; i < data.length; i++) {
                cardTemplate.find('.panel-title').text(data[i].name);
                cardTemplate.find('img').attr('src', data[i].picture);
                cardTemplate.find('.country').text(data[i].country);
                cardTemplate.find('.age').text(data[i].age);
                cardTemplate.find('.current-team').text(data[i].current_team);
                cardTemplate.find('.btn-adopt').attr('data-id', data[i].id);

                cardsRow.append(cardTemplate.html());
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
            // var provider = "https://sepolia.infura.io/v3balabala"
            var provider = "https://sepolia.infura.io/v3/Your API Key"
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

            // Use our contract to retrieve and mark the adopted cards
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
                    $('.panel-card').eq(i).find('button').text('Own').attr('disabled', true);
                }
            }
        }).catch(function (err) {
            console.log(err.message);
        });
    },


    handleAdopt: function (event) {
        event.preventDefault();

        var cardId = parseInt($(event.target).data('id'));

        var adoptionInstance;

        web3.eth.getAccounts(function (error, accounts) {
            if (error) {
                console.log(error);
            }

            var account = accounts[0];

            App.contracts.Adoption.deployed().then(function (instance) {
                adoptionInstance = instance;

                return adoptionInstance.adopt(cardId, { from: account });
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
