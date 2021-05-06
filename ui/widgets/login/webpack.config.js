// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require('../../webpack.config');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageName = require('./package.json').name;

module.exports = Object.assign(baseConfig, {
  context: path.resolve(__dirname),
  output: Object.assign(baseConfig.output, {
    library: packageName.replace(/@/g, '').replace(/\//g, '__').replace(/-/g, '_'),
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/widgets/login/',
  }),
});
