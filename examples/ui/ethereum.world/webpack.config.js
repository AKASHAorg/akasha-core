const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const { ModuleFederationPlugin } = webpack.container;
const path = require('path');
const baseConfig = require('../../../ui/webpack.config');

module.exports = Object.assign(baseConfig, {
  context: path.resolve(__dirname),
  entry: './src/bootstrap',
  plugins: baseConfig.plugins.concat([
    new ModuleFederationPlugin({
      name: 'ethereum.world',
      shared: {
        react: {
          singleton: true,
        },
        'react-dom': {
          singleton: true,
        },
        'styled-components': {
          singleton: true,
        }
      },
    }),
    new CopyPlugin({
      patterns: [
        { from: path.join(__dirname, 'dist'), to: path.join(__dirname, 'public') },
        { from: path.join(__dirname, '../../../ui/build'), to: path.join(__dirname, 'public') },
        { from: path.join(__dirname, '../../../locales'), to: path.join(__dirname, 'public/locales') }
      ]
    })
  ]),
  externals: {
    ...baseConfig.externals,
    'akasha.sdk.js': 'akashaproject__sdk',
  },
  devServer: {
    contentBase: 'public',
    publicPath: '/',
    https: true,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  }
});
