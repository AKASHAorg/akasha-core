const path = require('path');
const baseConfig = require('../../webpack.config');
const packageName = require('./package.json').name;

module.exports = Object.assign(baseConfig, {
  context: path.resolve(__dirname),
  output: Object.assign(baseConfig.output, {
    library: packageName.replace(/@/g, '').replace(/\//g, '__').replace(/-/g, '_'),
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    publicPath: '/plugins/',
  }),
});
