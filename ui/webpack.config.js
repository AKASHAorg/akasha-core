const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const commons = require('./app.pack.conf');

module.exports = {
  entry: './src/index.ts',
  mode: 'development',
  target: 'web',
  module: {
    rules: [{ parser: { System: false } }, { test: /\.ts(x)?$/, use: 'ts-loader' }],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  output: {
    libraryTarget: 'amd',
  },
  plugins: [
    new CleanWebpackPlugin({ verbose: true }),
    new webpack.ProgressPlugin({
      entries: true,
      modules: true,
      modulesCount: 100,
      profile: true,
    }),
    new HtmlWebpackPlugin(),
  ],
  devtool: 'source-map',
  externals: commons.externals,
  optimization: commons.optimization,
};
