require('@nomiclabs/hardhat-ethers');
require('@openzeppelin/hardhat-upgrades');

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: 'sepolia',
  networks: {
    development: {
      url: 'http://127.0.0.1:8545',
    },
    rinkeby: {
      url: process.env.RINKEBY_JSONRPC || 'http://127.0.0.1:8545',
      accounts: [process.env.ETH_DEPLOY_KEY],
    },
    sepolia: {
      chainId: 11155111,
      url: 'https://sepolia.infura.io/v3/' + process.env.INFURA_ID,
      accounts: [process.env.ETH_DEPLOY_KEY],
    },
  },
  solidity: {
    version: '0.8.9',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: './src/contracts/src',
    tests: './src/contracts/tests',
    cache: './src/contracts/cache',
    artifacts: './src/contracts/artifacts',
  },
};
