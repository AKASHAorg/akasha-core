// eslint-disable-next-line @typescript-eslint/no-var-requires
const CopyPlugin = require('copy-webpack-plugin');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require('../../libs/webpack.config');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
const webpack = require('webpack');
// remove manifest plugin
baseConfig.plugins.splice(1, 1);
module.exports = Object.assign(baseConfig, {
  context: path.resolve(__dirname),
  entry: {
    main: './src/index.ts',
    'setup.twind': './src/setup.twind.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/',
    crossOriginLoading: 'anonymous',
  },
  plugins: baseConfig.plugins.concat([
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, '../../dist') },
        // { from: path.resolve(__dirname, '../../../sdk/dist'), to: 'sdk' },
        // { from: path.resolve(__dirname, '../../../locales'), to: 'locales' },
      ],
    }),
    new webpack.DefinePlugin({
      __LOAD_LOCAL_SOURCES__: !!process.env.LOAD_LOCAL_SOURCES,
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
