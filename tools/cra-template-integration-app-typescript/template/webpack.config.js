/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const path = require('path');
const commons = require('./app.pack.conf');
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  context: path.resolve(__dirname),
  entry: './src/index',
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
    path: path.resolve(__dirname, 'dist'),
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
  devServer: {
    server: {
      type: 'https',
      options:
        process.env.DEV_CERT_KEY_PATH && process.env.DEV_CERT_PATH
          ? {
              key: fs.readFileSync(process.env.DEV_CERT_KEY_PATH),
              cert: fs.readFileSync(process.env.DEV_CERT_PATH),
            }
          : {},
    },
    static: {
      directory: path.join(__dirname, 'public'),
      publicPath: '/',
      staticOptions: {
        index: 'index.dev.html',
      },
    },
    historyApiFallback: {
      index: 'index.dev.html',
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: {
      '/locales': {
        target: 'https://next.akasha-world-framework.pages.dev',
        changeOrigin: true,
        secure: false,
      },
    },
  },
};
