const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: './src/index.ts',
  stats: 'errors-only',
  output: {
    // filename: 'bundle.js',
    // path: path.resolve(__dirname, 'public'),
    publicPath: 'http://localhost:30461',
  },
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      { parser: { system: false } },
      {
        test: /\.ts(x?)$/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
        exclude: [/\*d.ts(x?)$/, /\.map$/],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
        patterns: [
          // { from: 'public', to: '.' },
          // { from: 'serve.json', to: '.' },
        ]
      }),
    new ModuleFederationPlugin({
      name: 'ethereum_world',
      library: { type: 'amd' },
      filename: 'remoteEntry.js',
      exposes: {
        ethWorld: './src/index.ts'
      },
      remotes: {
        designSystem: 'designSystem',
      },
      shared: ['react', 'react-dom', 'single-spa', 'single-spa-react', 'rxjs'],
    }),
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
