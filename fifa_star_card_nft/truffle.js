// module.exports = {
//     networks: {
//         development: {
//             host: "localhost",
//             port: 8545,
//             network_id: "*" // Match any network id
//         }
//     }
// };

const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

const infuraKey = process.env.INFURA_API_KEY;
// const mnemonic = process.env.MNEMONIC;
const privateKey = process.env.PRIVATE_KEY;

console.log("infuraKey: ", infuraKey);

module.exports = {
    networks: {
        // Existing configurations...
        sepolia: {
            provider: () => new HDWalletProvider(privateKey, infuraKey),
            network_id: 11155111, // Sepolia's network id
            gas: 5500000,        // Gas limit used for deploys
            confirmations: 2,    // # of confs to wait between deployments. (default: 0)
            timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
            skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
        },
        // Other network configurations...
    },

    // Truffle DB is currently disabled by default; to enable it, change enabled: false to enabled: true
    //
    // Note: if you migrated your contracts prior to enabling this field in your Truffle project and want
    // those previously migrated contracts available in the .db directory, you will need to run the following:
    // $ truffle migrate --reset --compile-all

    db: {
        enabled: false
    }
};
