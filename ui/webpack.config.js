const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const commons = require('./app.pack.conf');

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
          presets: [
            [
              '@babel/preset-env', {
                useBuiltIns: 'usage',
                corejs: 3,
                targets: '> 0.25%, not dead'
              }
            ],
            '@babel/preset-react',
            '@babel/preset-typescript'
          ],
          plugins: [
            '@babel/plugin-proposal-class-properties'
          ]
        },
      },
      {
        test: /.(js|mjs)$/,
        loader: 'babel-loader',
        exclude: /public/,
        resolve: { fullySpecified: false }
      }
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  output: {
    publicPath: 'auto'
  },
  plugins: [
    new CleanWebpackPlugin({ verbose: true }),
    new webpack.ProgressPlugin({
      entries: true,
      modules: true,
      modulesCount: 100,
      profile: true,
    })
  ],
  devtool: 'source-map',
  externals: commons.externals,
  optimization: commons.optimization,
};
