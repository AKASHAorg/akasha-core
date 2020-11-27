const path = require('path');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const baseConfig = require('../../ui/webpack.config');
const packageName = require('./package.json').name;

module.exports = Object.assign(baseConfig, {
  context: path.resolve(__dirname),

  plugins: baseConfig.plugins.concat([
    new ModuleFederationPlugin({
      // akashaproject__app_moderation_ewa
      name: packageName.replace(/@/g, '').replace(/\//g, '__').replace(/-/g, '_'),
      filename: 'index.js',
      exposes: {
        './app': './src/index',
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
