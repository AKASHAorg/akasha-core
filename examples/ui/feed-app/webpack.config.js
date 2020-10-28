const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: './src/index.ts',
  stats: 'errors-only',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/',
  },
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      { parser: { System: false } },
      {
        test: /\.ts(x?)$/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
        exclude: {
          test: [/\*d.ts(x?)$/, /\.map$/],
        },
      },
    ],
  },
  plugins: [
    new CopyPlugin([
      { from: path.resolve(__dirname, '../../../ui/build') },
      {
        from: path.resolve(__dirname, '../../../locales'),
        to: 'locales',
      },
    ]),
    new HtmlWebpackPlugin({ template: path.resolve(__dirname, './public/index.html') }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  // fix infinite loop of compilation when
  // a new string is added to translations
  watchOptions: {
    ignored: [path.resolve(__dirname, '../../../locales'), 'node_modules'],
  },
  devServer: {
    contentBase: './public',
    https: true,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
};
