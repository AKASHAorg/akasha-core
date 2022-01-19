// eslint-disable-next-line @typescript-eslint/no-var-requires
const CopyPlugin = require('copy-webpack-plugin');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require('../../../ui/webpack.config');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

module.exports = Object.assign(baseConfig, {
  context: path.resolve(__dirname),
  entry: './src/index',
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: baseConfig.plugins.concat([
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, '../../../ui/build') },
        { from: path.resolve(__dirname, '../../../sdk/dist') },
        { from: path.resolve(__dirname, '../../../locales'), to: 'locales' },
      ],
    }),
  ]),
  externals: baseConfig.externals,
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
    // serve development versions of libs
    // https://github.com/webpack/webpack-dev-server/issues/2540
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
  },
});
