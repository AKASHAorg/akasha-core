const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const commons = require('./app.pack.conf');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  entry: './src/index',
  mode: process.env.NODE_ENV || 'development',
  target: 'web',
  module: {
    rules: [
      { test: /\.ts(x)?$/, use: 'ts-loader' },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  output: {
    publicPath: 'auto',
  },
  plugins: [
    new CleanWebpackPlugin({ verbose: true }),
    new webpack.AutomaticPrefetchPlugin(),
    new webpack.ProgressPlugin({
      entries: true,
      modules: true,
      modulesCount: 100,
      profile: true,
    }),
  ],
  devtool: isProduction ? 'source-map' : 'inline-source-map',
  externals: commons.externals,
  optimization: commons.optimization,
};
