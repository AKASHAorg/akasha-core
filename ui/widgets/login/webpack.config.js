const path = require('path');
const baseConfig = require('../../webpack.config');
const packageName = require('./package.json').name;

const config = {
    context: path.resolve(__dirname),
    output: {
      libraryTarget: baseConfig.output.libraryTarget,
      library: packageName.replace(/@/g, '').replace(/\//g, '__').replace(/-/g, '_'),
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.js',
      publicPath: '/widgets/',
    },
  };

module.exports = Object.assign({}, baseConfig, config);
