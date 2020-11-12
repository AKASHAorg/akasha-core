const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const { ModuleFederationPlugin } = webpack.container;

const path = require('path');
const deps = require('./package.json').dependencies;

module.exports = {
  entry: './src/index',
  mode: 'development',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 3001,
  },
  devtool: 'source-map',
  output: {
    publicPath: 'auto',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    // @TODO: check if these polyfills are really used
    // if not, change to <false> and remove the package from package.json;
    fallback: {
      "stream": require.resolve('stream-browserify/'),
      "path": require.resolve('path-browserify/'),
      "assert": require.resolve('assert/'),
      "util": require.resolve('util/'),
      "buffer": require.resolve('buffer/'),
    }
  },
  module: {
    rules: [
      { test: /.(js|mjs)$/, loader: 'babel-loader', resolve: { fullySpecified: false } },
      {
        test: /bootstrap\.tsx$/,
        loader: 'bundle-loader',
        exclude:/.sdk.js$/,
        options: {
          lazy: true,
        },
      },
      {
        test: /\.ts(x)?$/,
        loader: 'babel-loader',
        exclude: [/node_modules/, /.sdk.js$/],
        options: {
          presets: ['@babel/preset-react', '@babel/preset-typescript'],
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'ethereum.world',
      shared: {
        react: {
          singleton: true,
        },
        'react-dom': {
          singleton: true,
        },
      },
    }),
    new webpack.ProgressPlugin({
      entries: true,
      modules: true,
      modulesCount: 100,
      profile: true,
      dependencies: false,
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new CopyPlugin({
      patterns: [
        { from: 'public' }
      ]
    })
  ],
};
