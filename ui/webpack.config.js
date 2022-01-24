/* eslint-disable */
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const commons = require('./app.pack.conf');
const path = require('path');
const Dotenv = require('dotenv-webpack');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const { SubresourceIntegrityPlugin } = require("webpack-subresource-integrity");
const WebpackAssetsManifest = require("webpack-assets-manifest");
const isProduction = process.env.NODE_ENV === 'production';

const outputMainFile = 'index.js';
const exp = {
  entry: './src/index',
  mode: process.env.NODE_ENV || 'development',
  target: ['web', 'es2017'],
  module: {
    rules: [
      { test: /\.ts(x)?$/, use: 'ts-loader' },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  output: {
    libraryTarget: 'system',
    publicPath: 'auto',
    filename: outputMainFile,
    crossOriginLoading: 'anonymous',
  },
  plugins: [
    new CleanWebpackPlugin({ verbose: true }),
    new WebpackManifestPlugin({
      generate: (seed, files, entries) => {
      const packageJson = require(path.join(process.cwd(), './package.json'));
      return {
        mainFile: outputMainFile,
        license: packageJson.license,
        description: packageJson.description,
        keywords: packageJson.keywords || []
      };
      }
    }),
    new Dotenv({
      path: path.resolve(__dirname, '../.env'),
      safe:
        process.env.NODE_ENV === 'production' ? path.resolve(__dirname, '../.env.example') : false,
      systemvars: true,
    }),
    new webpack.DefinePlugin({
      __DEV__: !isProduction,
    }),
    new webpack.AutomaticPrefetchPlugin(),
    new SubresourceIntegrityPlugin({
      enabled: isProduction,
    }),
    new WebpackAssetsManifest({ integrity: true }),
    // new webpack.ProgressPlugin({
    //   entries: true,
    //   modules: true,
    //   modulesCount: 100,
    //   profile: true,
    // }),
  ],
  devtool: isProduction ? 'source-map' : 'inline-source-map',
  externals: commons.externals,
  optimization: commons.optimization,
};

module.exports = exp;
