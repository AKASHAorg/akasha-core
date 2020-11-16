const baseConfig = require('../../webpack.config.dev');
const path = require('path');
const packageName = require('./package.json').name;
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = Object.assign(baseConfig, {
  context: path.resolve(__dirname),
  plugins: baseConfig.plugins.concat([
    new ModuleFederationPlugin({
      // akashaproject__ui_plugin_app_center
      name: packageName.replace(/\@/g, '').replace(/\//g, '__').replace(/\-/g, '_'),
      filename: 'remoteEntry.js',
      exposes: {
        './app': './src/index'
      },
      shared: {
        react: {
          singleton: true,
        },
        'react-dom': {
          singleton: true,
        },
        rxjs: {
          singleton: true,
        }
      },
    })
  ])
});
