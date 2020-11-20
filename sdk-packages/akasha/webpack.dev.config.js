const path = require('path');
const webpack = require('webpack');
const name = require('./package.json').name;
const { InjectManifest } = require('workbox-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production'

const config = {
  entry: './src/index.ts',
  context: path.resolve(__dirname),
  module: {
    rules: [
      {
        test: /.(js|mjs)$/,
        loader: 'babel-loader',
        exclude: [/lib/, /dist/],
        resolve: { fullySpecified: false }
      },
      {
        test: /\.ts(x)?$/,
        loader: 'babel-loader',
        options: {
          plugins: ["@babel/plugin-syntax-dynamic-import"],
          presets: [
            "@babel/preset-env",
            '@babel/preset-typescript'
          ]
        }
      }],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      assert: require.resolve("assert/"),
      buffer: require.resolve("buffer"),
      path: require.resolve("path-browserify/"),
      stream: require.resolve("stream-browserify/"),
      util: require.resolve("util/"),
      process: require.resolve("process/browser"),
    }
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'akasha.sdk.js',
    library: name.replace(/@/, '').replace(/\//, '__').replace(/-/, '_'),
    libraryTarget: 'umd',
    publicPath: '/',
  },
  optimization: {
    moduleIds: 'deterministic',
    minimize: isProduction,
  },
  plugins: [
    new webpack.ProgressPlugin({
      entries: true,
      modules: true,
      modulesCount: 100,
      profile: true,
    }),
    new webpack.AutomaticPrefetchPlugin(),
    // Makes sure the following is polyfilled in client-side bundles
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      stream: ['stream'],
      process: ['process']
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        GRAPHQL_URI: JSON.stringify('http://api.akasha.network/query'),
      }
    }),
    new InjectManifest({
      swSrc: './lib/sw.js',
      swDest: 'sw.js',
      exclude: [/.*?/]
    })
  ],
  devtool: isProduction ? false : 'eval-source-map',
  mode: process.env.NODE_ENV || 'development',
  externals: [
    /^@truffle\/contract$/,
  ],
};

module.exports = config;
