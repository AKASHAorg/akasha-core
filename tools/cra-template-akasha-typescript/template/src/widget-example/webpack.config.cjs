/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const baseConfig = require('../../webpack.config');

module.exports = Object.assign(baseConfig, {
  context: path.resolve(__dirname),
  entry: './index',
  output: Object.assign(baseConfig.output, {
    path: path.resolve(__dirname, 'dist'),
  }),
});
