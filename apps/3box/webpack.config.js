const path = require('path');
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const baseConfig = require('../../webpack.config');

module.exports = Object.assign(baseConfig, {
  context: path.resolve(__dirname),
  plugins: baseConfig.plugins.concat([
    new ModuleFederationPlugin({
      // akashaproject__app_3box_integration
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
