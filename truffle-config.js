const path = require("path");

var HDWalletProvider = require("truffle-hdwallet-provider");
mnemonic = ''

module.exports = {
  networks: {
    local: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://ropsten.infura.io/v3/85bea10d988b4fdd871fa850ffe63f60`
        ),
      network_id: 3, // Ropsten's id
      gas: 5500000, // Ropsten has a lower block limit than mainnet
      confirmations: 0, // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
      from: "0xf634FFd037f4D8aE1ebc244Ae4ac920062AF41c4",
    },
  }
};

   // -------------------------
   // > transaction hash:    0xf801e6c3c11f610ad010cb26a37d7e741d9da9e473085b2f1635e4487884017c
   // > Blocks: 1            Seconds: 28
   // > contract address:    0xE0EDe3a0cE45c58f190382E92237fCc6Bc3c92A9
   // > block number:        11484989
   // > block timestamp:     1637731910
   // > account:             0xf634FFd037f4D8aE1ebc244Ae4ac920062AF41c4
   // > balance:             7.298055563512981417
   // > gas used:            350163 (0x557d3)
   // > gas price:           1.649000003 gwei
   // > value sent:          0 ETH
   // > total cost:          0.000577418788050489 ETH