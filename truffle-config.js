const path = require('path');
require('dotenv').config({ path: './.env' });
const HDWalletProvider = require('@truffle/hdwallet-provider');
const AccountIndex = 0;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, 'client/src/build'),
  networks: {
    develop: {
      port: 8545,
    },
    ganache_local: {
      provider: () =>
        new HDWalletProvider(
          process.env.MNEMONIC,
          process.env.PROVIDER_URL_DEV,
          AccountIndex
        ),
      network_id: 5777,
    },
    goerli_infura: {
      provider: () =>
        new HDWalletProvider(
          process.env.MNEMONIC,
          process.env.PROVIDER_URL,
          AccountIndex
        ),
      network_id: 5,
    },
  },
  compilers: {
    solc: {
      version: '0.8.1',
    },
  },
};
