const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ModuleFederationPlugin = webpack.container.ModuleFederationPlugin;

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
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'widget_ethereum_layout',
      filename: 'remoteEntry.js',
      exposes: {
        './app': './src/app-config'
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
    new webpack.ProgressPlugin({
      entries: true,
      modules: true,
      modulesCount: 100,
      profile: true,
      dependencies: false,
    }),
    new CopyPlugin({
      patterns: [
        { from: 'serve.json' }
      ]
    })
  ],
}

// const config = {
//   context: path.resolve(__dirname),
//   output: {
//     libraryTarget: baseConfig.output.libraryTarget,
//     // library: 'ui-widget-sidebar',
//     path: path.resolve(__dirname, 'dist'),
//     filename: 'layout.js',
//     publicPath: '/widgets/',
//   },
// };

// module.exports = Object.assign({}, baseConfig, config);
