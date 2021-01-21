const path = require('path');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const baseConfig = require('../../ui/webpack.config');
const packageName = require('./package.json').name;

module.exports = Object.assign(baseConfig, {
  context: path.resolve(__dirname),

  plugins: baseConfig.plugins.concat([
    new ModuleFederationPlugin({
      // akashaproject__app_akasha_integration
      name: packageName.replace(/@/g, '').replace(/\//g, '__').replace(/-/g, '_'),
      filename: 'index.js',
      exposes: {
        './app': './src/bootstrap',
      },
      remotes: {
        loginWidgetConfig: 'loginWidgetConfig@https://localhost:8131/widgets/login/index.js',
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
