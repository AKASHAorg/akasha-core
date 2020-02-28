const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { InjectManifest } = require('workbox-webpack-plugin');

const config = {
  entry: './lib/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    hashFunction: 'sha384',
    hashDigest: 'hex',
    hashDigestLength: 20,
    filename: 'akasha.[name].[contenthash].js',
    library: 'AkashaSDK',
    libraryTarget: 'window',
    umdNamedDefine: true,
    publicPath: '/',
  },
  optimization: {
    minimize: false,
    moduleIds: 'hashed',
    occurrenceOrder: true,
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          reuseExistingChunk: true,
        },
      },
    },
  },
  plugins: [
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
      swDest: 'sw.js'
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  devtool: 'source-map',
  mode: 'development',
};

module.exports = config;
