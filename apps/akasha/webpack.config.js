const path = require('path');
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const CopyPlugin = require('copy-webpack-plugin');
// const baseConfig = require('../../ui/webpack.config');
const package = require('./package.json');

const config = {
  entry: './src/index',
  context: path.resolve(__dirname),
  mode: 'development',
  output: {
    publicPath: 'auto',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      // {
      //   test: /bootstrap\.tsx$/,
      //   loader: 'bundle-loader',
      //   options: {
      //     lazy: true,
      //   },
      // },
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-react', '@babel/preset-typescript'],
          plugins: ['@babel/plugin-proposal-class-properties']
        }
      }
    ]
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'akashaproject_appAkashaIntegration',
      filename: 'remoteEntry.js',
      exposes: {
        './app': './src/bootstrap'
      },
      shared: {
        react: {
          singleton: true,
        },
        'react-dom': {
          singleton: true,
        },
      },
    }),
    new CopyPlugin({
      patterns: [
        { from: 'serve.json', to: '.' }
      ]
    })
  ]
};

module.exports = config;
