/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const baseConfig = require('../webpack.config');

module.exports = Object.assign(baseConfig, {
  context: path.resolve(__dirname),
  entry: './index',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    crossOriginLoading: 'anonymous',
  },
});
