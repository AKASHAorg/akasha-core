// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require('webpack');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const commons = require('./app.pack.conf');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
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
    libraryTarget: 'umd',
    publicPath: 'auto',
    filename: 'index.js',
  },
  plugins: [
    new CleanWebpackPlugin({ verbose: true }),
    new webpack.EnvironmentPlugin({
      MODERATION_API:
        process.env.MODERATION_API || 'https://staging-api.ethereum.world/api/moderation',
      INFURA_ID: process.env.INFURA_ID || '',
      BUCKET_VERSION: process.env.BUCKET_VERSION || '',
      EWA_MAILSENDER: process.env.EWA_MAILSENDER || '',
    }),
    new webpack.DefinePlugin({
      __DEV__: process.env.NODE_ENV !== 'production',
    }),
    new webpack.AutomaticPrefetchPlugin(),
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
