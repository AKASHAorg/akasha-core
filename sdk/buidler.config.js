usePlugin('@nomiclabs/buidler-waffle');
module.exports = {
  defaultNetwork: 'rinkeby',
  networks: {
    development: {
      url: 'http://127.0.0.1:7545',
    },
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/' + process.env.INFURA_ID,
      accounts: [],
    },
  },
  solc: {
    version: '0.8.9',
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  paths: {
    sources: './src/contracts/src',
    tests: './src/contracts/tests',
    cache: './src/contracts/cache',
    artifacts: './src/contracts/artifacts',
  },
};
