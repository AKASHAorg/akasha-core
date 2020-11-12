const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { InjectManifest } = require('workbox-webpack-plugin');

const config = {
  entry: './src/index.ts',
  context: path.resolve(__dirname),
  module: {
    rules: [{ parser: { System: false } }, { test: /\.ts(x)?$/, use: 'ts-loader' }],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'akasha.sdk.js',
    libraryTarget: 'umd',
    publicPath: '/',
  },
  optimization: {
    moduleIds: 'hashed',
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      GRAPHQL_URI: 'http://api.akasha.network/query',
      NODE_ENV: process.env.NODE_ENV || 'development'
    }),
    new webpack.ProgressPlugin({
      entries: true,
      modules: true,
      modulesCount: 100,
      profile: true,
    }),
    new webpack.AutomaticPrefetchPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../../examples/ui/ethereum.world/public/template-index.html'),
      inject: true,
    }),
    new InjectManifest({
      swSrc: './lib/sw.js',
      swDest: 'sw.js',
      exclude: [/.*?/]
    })
  ],
  devtool: 'source-map',
  mode: process.env.NODE_ENV || 'development',
  externals: [
    /^single-spa$/,
    /^@truffle\/contract$/,
  ],
};

module.exports = config;
