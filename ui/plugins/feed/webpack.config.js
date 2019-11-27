const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const commons = require('../../app.pack.conf');
module.exports = {
  entry: './lib/index.js',
  output: {
    libraryTarget: 'system',
    //library: 'ui-plugin-feed',
    path: path.resolve(__dirname, 'dist'),
    filename: 'feed.js',
    publicPath: '/plugins/',
  },
  mode: 'development',
  module: {
    rules: [
      { parser: { System: false } },
      {
        test: /\.js?$/,
        exclude: [path.resolve(__dirname, 'node_modules')],
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    modules: [__dirname, 'node_modules'],
  },
  plugins: [
    new webpack.ProgressPlugin({
      entries: true,
      modules: true,
      modulesCount: 100,
      profile: true,
    }),
    new CleanWebpackPlugin({ verbose: true }),
    new HtmlWebpackPlugin(),
  ],
  devtool: 'source-map',
  externals: commons.externals,
  optimization: commons.optimization,
};
