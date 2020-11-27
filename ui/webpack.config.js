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
      {
        test: /\.ts(x)?$/,
        loader: 'babel-loader',
        exclude: [/node_modules/, /public/],
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
          plugins: ['@babel/transform-runtime', '@babel/plugin-proposal-class-properties'],
        },
      },
      {
        test: /.(js|mjs)$/,
        loader: 'babel-loader',
        exclude: /public/,
        resolve: { fullySpecified: false },
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
    new webpack.ProgressPlugin({
      entries: true,
      modules: true,
      modulesCount: 100,
      profile: true,
    }),
  ],
  devtool: isProduction ? false : 'source-map',
  externals: commons.externals,
  optimization: commons.optimization,
};
