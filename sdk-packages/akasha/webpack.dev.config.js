const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// const WorkboxPlugin = require('workbox-webpack-plugin');
const config = {
  entry: './lib/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'akasha.[name].[contenthash].js',
    library: 'AkashaSDK',
    libraryTarget: 'umd',
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
    // new WorkboxPlugin.GenerateSW()
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
  target: 'web',
  devtool: 'source-map',
  mode: 'production',
};

module.exports = config;
