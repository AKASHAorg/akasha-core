/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const path = require('path');
const commons = require('./app.pack.conf');
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  context: path.resolve(__dirname),
  mode: process.env.NODE_ENV || 'development',
  target: ['web', 'es2017'],
  module: {
    rules: [
      {
        test: /\.ts(x)?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.webpack.json',
            },
          },
        ],
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    libraryTarget: 'system',
    publicPath: 'auto',
    filename: 'index.js',
    crossOriginLoading: 'anonymous',
    clean: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: !isProduction,
    }),
  ],
  devtool: isProduction ? 'source-map' : 'inline-source-map',
  externals: commons.externals,
  optimization: commons.optimization,
  watchOptions: {
    ignored: /node_modules|public|lib/,
  },
};
