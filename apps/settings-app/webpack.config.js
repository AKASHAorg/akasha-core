// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require('../../ui/webpack.config');

module.exports = Object.assign(baseConfig, {
  context: path.resolve(__dirname),
  output: Object.assign(baseConfig.output, {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/apps/settings-app/',
  }),
});
