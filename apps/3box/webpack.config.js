const path = require('path');
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const baseConfig = require('../../ui/webpack.config');
const packageName = require('./package.json').name;

module.exports = Object.assign(baseConfig, {
  context: path.resolve(__dirname),
  resolve: {
    ...baseConfig.resolve,
    fallback: {
      "path": require.resolve('path-browserify/'),
      "util": require.resolve('util/'),
      "assert": require.resolve('assert/'),
      "crypto": require.resolve('crypto-browserify/'),
      "stream": require.resolve('stream-browserify/'),
    }
  },
  plugins: baseConfig.plugins.concat([
    new ModuleFederationPlugin({
      // akashaproject__app_3box_integration
      name: packageName.replace(/@/g, '').replace(/\//g, '__').replace(/-/g, '_'),
      filename: 'index.js',
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
        'styled-components': {
          singleton: true,
        },
      },
    })
  ])
});
