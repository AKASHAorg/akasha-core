const config = require('./webpack.config.js');
const webpack = require('webpack');

config.plugins.push(new webpack.HotModuleReplacementPlugin());
config.devServer = {
  contentBase: './dist',
  historyApiFallback: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
};
config.externals = [];
config.mode = 'development';

module.exports = config;
