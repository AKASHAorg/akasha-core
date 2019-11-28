const path = require('path');
const baseConfig = require('../webpack.config');

const config = {
  context: path.resolve(__dirname),
  output: {
    libraryTarget: baseConfig.output.libraryTarget,
    //library: 'design-system',
    path: path.resolve(__dirname, 'dist'),
    filename: 'design-system.js',
    publicPath: '/',
  },
};

module.exports = Object.assign({}, baseConfig, config);
