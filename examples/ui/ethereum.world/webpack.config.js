const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const { ModuleFederationPlugin } = webpack.container;
const path = require('path');
const baseConfig = require('../../../ui/webpack.config');

module.exports = Object.assign(baseConfig, {
  context: path.resolve(__dirname),
  entry: './src/bootstrap',
  // devServer: {
  //   contentBase: path.join(__dirname, 'dist'),
  //   port: 3001,
  // },
  // module: {
  //   rules: baseConfig.module.rules.concat([
  //     {
  //       test: /bootstrap\.tsx$/,
  //       loader: 'bundle-loader',
  //       exclude:/.sdk.js$/,
  //       options: {
  //         lazy: true,
  //       },
  //     },
  //   ]),
  // },
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
    // new HtmlWebpackPlugin({
    //   template: './public/index.html',
    //   publicPath: '/'
    // }),
    new CopyPlugin({
      patterns: [
        { from: 'public' }
      ]
    })
  ]),
  externals: {
    ...baseConfig.externals,
    'akasha.sdk.js': 'akashaproject__sdk',
  }
});
