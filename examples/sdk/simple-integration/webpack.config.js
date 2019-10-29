const path = require('path');
const webpack = require('webpack');

const config = {
  entry: './lib/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'example-integration.[contenthash].js',
    libraryTarget: 'umd',
    publicPath: '/',
  },
  plugins: [
    new webpack.ProgressPlugin({
      entries: true,
      modules: true,
      modulesCount: 100,
      profile: true,
    }),
    new webpack.AutomaticPrefetchPlugin(),
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
