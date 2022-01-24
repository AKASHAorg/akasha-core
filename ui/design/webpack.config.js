/* eslint-disable */
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require('../webpack.config');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageName = require('./package.json').name;

module.exports = Object.assign(baseConfig, {
  context: path.resolve(__dirname),
  output: Object.assign(baseConfig.output, {
    //library: packageName.replace(/@/, '').replace(/\//, '__').replace(/-/, '_'),
    filename: 'index.js',
    publicPath: process.env.NODE_ENV !== 'production' ? '/design/' : 'auto',
    path: path.resolve(__dirname, 'dist'),
  }),
});
