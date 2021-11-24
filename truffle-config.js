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

   // Deploying 'PayItBackward'
   // -------------------------
   // > transaction hash:    0x69ae985c5d7bb0a33baa7d43f37c54639f000f704621cf80ca4cb9487b20c50f
   // > Blocks: 0            Seconds: 16
   // > contract address:    0x008515D0f93e3f86D025378D3Db9152EF38478B6
   // > block number:        11478924
   // > block timestamp:     1637644413
   // > account:             0xf634FFd037f4D8aE1ebc244Ae4ac920062AF41c4
   // > balance:             7.299028501548280928
   // > gas used:            350163 (0x557d3)
   // > gas price:           1.648999992 gwei
   // > value sent:          0 ETH
   // > total cost:          0.000577418784198696 ETH