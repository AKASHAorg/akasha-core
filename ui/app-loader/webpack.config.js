// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require('../webpack.config');

module.exports = Object.assign(baseConfig, {
  context: path.resolve(__dirname),
  output: Object.assign(baseConfig.output, {
    publicPath: process.env.NODE_ENV !== 'production' ? '/app-loader/' : 'auto',
    path: path.resolve(__dirname, 'dist'),
  }),
});
