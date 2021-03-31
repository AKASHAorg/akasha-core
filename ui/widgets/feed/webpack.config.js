const path = require('path');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const baseConfig = require('../../webpack.config');
const packageName = require('./package.json').name;

module.exports = Object.assign(baseConfig, {
  context: path.resolve(__dirname),
  plugins: baseConfig.plugins.concat([
    new ModuleFederationPlugin({
      // akashaproject__ui_widget_feed
      name: packageName.replace(/@/g, '').replace(/\//g, '__').replace(/-/g, '_'),
      filename: 'index.js',
      exposes: {
        './app': './src/bootstrap',
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
    }),
  ]),
});
