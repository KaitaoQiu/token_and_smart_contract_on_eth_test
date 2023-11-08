// var ConvertLib = artifacts.require("./ConvertLib.sol");
// var MetaCoin = artifacts.require("./MetaCoin.sol");

// module.exports = function(deployer) {
//   deployer.deploy(ConvertLib);
//   deployer.link(ConvertLib, MetaCoin);
//   deployer.deploy(MetaCoin);
// };

var Adoption = artifacts.require("Adoption");
// var Marketplace = artifacts.require("Marketplace");

// module.exports = function (deployer) {
//     deployer.deploy(Marketplace);
// };


module.exports = function(deployer) {
    deployer.deploy(Adoption);
    // deployer.deploy(Marketplace);
};