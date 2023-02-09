/* eslint-disable */
const path = require('path');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require('../webpack.config');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageName = require('./package.json').name;
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  ...baseConfig,
  context: path.resolve(__dirname),
  entry: {
    Button: './src/components/Button',
    Card: './src/components/Card',
    Icon: './src/components/Icon',
    Topbar: './src/components/Topbar',
    TrendingWidgetCard: './src/components/TrendingWidgetCard',
  },
  output: Object.assign(baseConfig.output, {
    //library: packageName.replace(/@/, '').replace(/\//, '__').replace(/-/, '_'),
    filename: '[name].js',
    publicPath: 'auto',
    path: path.resolve(__dirname, 'dist'),
    devtoolNamespace: packageName,
  }),
  // plugins: [new BundleAnalyzerPlugin()].concat(baseConfig.plugins)
};
