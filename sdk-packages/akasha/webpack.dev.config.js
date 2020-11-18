const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const name = require('./package.json').name;
const { InjectManifest } = require('workbox-webpack-plugin');

const config = {
  entry: './src/index.ts',
  context: path.resolve(__dirname),
  module: {
    rules: [
      {
        test: /.(js|mjs)$/,
        loader: 'babel-loader',
        exclude: [/lib/],
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
    fallback: {
      "assert": require.resolve("assert/"),
      "buffer": require.resolve("buffer/"),
      "path": require.resolve("path-browserify/"),
      "process": require.resolve("process/browser.js"),
      "stream": require.resolve("stream-browserify/"),
      "util": require.resolve("util/"),
    }
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'akasha.sdk.js',
    library: name.replace(/@/, '').replace(/\//, '__').replace(/\-/, '_'),
    libraryTarget: 'umd',
    publicPath: '/',
  },
  optimization: {
    moduleIds: 'deterministic',
    minimize: process.env.NODE_ENV !== 'development',
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      GRAPHQL_URI: 'http://api.akasha.network/query',
      NODE_ENV: process.env.NODE_ENV || 'development'
    }),
    new webpack.ProgressPlugin({
      entries: true,
      modules: true,
      modulesCount: 100,
      profile: true,
    }),
    new webpack.AutomaticPrefetchPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../../examples/ui/ethereum.world/public/template-index.html'),
      inject: true,
    }),
    // these packages must be available globally (in our case in window)
    // to avoid this we'll use webpack providePlugin which should replace all occurences
    // with the exports provided here:
    //    Buffer.from() => __webpack_imported_module(someModId).from()
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process'
    }),
    new InjectManifest({
      swSrc: './lib/sw.js',
      swDest: 'sw.js',
      exclude: [/.*?/]
    })
  ],
  devtool: 'inline-source-map',
  mode: process.env.NODE_ENV || 'development',
  externals: [
    /^@truffle\/contract$/,
  ],
};

module.exports = config;
