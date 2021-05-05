const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const baseConfig = require('../../../ui/webpack.config');

module.exports = Object.assign(baseConfig, {
  context: path.resolve(__dirname),
  entry: './src/bootstrap',
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: baseConfig.plugins.concat([
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, '../../../ui/build') },
        { from: path.resolve(__dirname, '../../../sdk-packages/akasha/dist') },
        { from: path.resolve(__dirname, '../../../locales'), to: 'locales' },
      ],
    }),
  ]),
  externals: {
    ...baseConfig.externals,
    'akasha.sdk.js': 'akashaproject__sdk',
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    publicPath: '/',
    https: true,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
});
