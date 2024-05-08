const path = require('path');
const baseConfig = require('../webpack.config');

const config = {
  context: path.resolve(__dirname),
  output: {
    libraryTarget: baseConfig.output.libraryTarget,
    path: path.resolve(__dirname, '../../dist/libs/hooks'),
    filename: 'index.js',
    publicPath: 'auto',
  },
};

module.exports = Object.assign({}, baseConfig, config);
