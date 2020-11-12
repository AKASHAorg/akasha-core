const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const commons = require('./app.pack.conf');

module.exports = {
  entry: './src/index.ts',
  mode: process.env.NODE_ENV || 'development',
  target: 'web',
  module: {
    rules: [
      { parser: { system: false } },
      { test: /\.ts(x)?$/, use: 'ts-loader' },
      { test: /.(js|mjs)$/, loader: 'babel-loader', resolve: { fullySpecified: false } }
    ],
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
  ],
  devtool: 'source-map',
  externals: commons.externals,
  optimization: commons.optimization,
};
