/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs');
const baseConfig = require('../webpack.config');

module.exports = Object.assign(baseConfig, {
  context: path.resolve(__dirname),
  entry: './index',
  output: {
    path: path.resolve(__dirname, '../public'),
    filename: 'main.js',
    crossOriginLoading: 'anonymous',
  },
  devServer: {
    devMiddleware: {
      writeToDisk: true,
    },
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
      directory: path.join(__dirname, '../public'),
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
  },
});
