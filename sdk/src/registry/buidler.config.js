usePlugin('@nomiclabs/buidler-waffle');
module.exports = {
  defaultNetwork: 'rinkeby',
  networks: {
    development: {
      url: 'http://127.0.0.1:7545',
    },
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/21f3771ff3814c3db46dfcd216c9e672',
      accounts: [],
    },
  },
  solc: {
    version: '0.5.15',
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './src/artifacts',
  },
};
