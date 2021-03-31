const config = require('./webpack.config.js');
const webpack = require('webpack');
const path = require('path');

config.plugins.push(new webpack.HotModuleReplacementPlugin());
config.devServer = {
  contentBase: './dist',
  historyApiFallback: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
};
config.output = {
  path: path.join(__dirname, 'dist'),
  publicPath: '/',
  filename: 'bundle.[hash].js',
};

config.externals = [];
config.mode = 'development';

module.exports = config;
