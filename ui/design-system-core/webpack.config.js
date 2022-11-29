/* eslint-disable */
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require('../webpack.config');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageName = require('./package.json').name;
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = Object.assign(baseConfig, {
  context: path.resolve(__dirname),
  output: Object.assign(baseConfig.output, {
    //library: packageName.replace(/@/, '').replace(/\//, '__').replace(/-/, '_'),
    filename: 'index.js',
    publicPath: 'auto',
    path: path.resolve(__dirname, 'dist'),
  }),
  // plugins: [new BundleAnalyzerPlugin()].concat(baseConfig.plugins)
});
