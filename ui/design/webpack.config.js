const path = require('path');
const baseConfig = require('../webpack.config');
const packageName = require('./package.json').name;

module.exports = Object.assign(baseConfig, {
  context: path.resolve(__dirname),
  output: {
    library: packageName.replace(/@/, '').replace(/\//, '__').replace(/-/, '_'),
    libraryTarget: 'umd',
  },
});
