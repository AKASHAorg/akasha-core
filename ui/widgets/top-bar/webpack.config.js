const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { name } = require('./lib/index');

module.exports = {
  entry: './lib/index.js',
  output: {
    libraryTarget: 'system',
    library: name,
    path: path.resolve(__dirname, 'dist'),
    filename: 'topbar.js',
  },
  mode: 'production',
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
    new webpack.AutomaticPrefetchPlugin(),
    new HtmlWebpackPlugin(),
  ],
  devtool: 'source-map',
};
