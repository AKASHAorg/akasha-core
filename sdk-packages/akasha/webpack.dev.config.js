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
    minimize: false,
    moduleIds: 'hashed',
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      GRAPHQL_URI: 'http://api.akasha.network/query'
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
      template: path.resolve(__dirname, '../../examples/ui/feed-app/public/template-index.html'),
      inject: true,
    }),
    new InjectManifest({
      swSrc: './lib/sw.js',
      swDest: 'sw.js',
      exclude: [/.*?/]
    })
  ],
  devtool: 'source-map',
  mode: 'development',
  externals: [
    /^single-spa$/,
    /^rxjs$/,
    /^rxjs\/operators$/,
    /^@truffle\/contract$/,
  ],
};

module.exports = config;
