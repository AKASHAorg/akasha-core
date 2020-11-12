const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const baseConfig = require('../webpack.config');

const config = {
  context: path.resolve(__dirname),
  output: {
    libraryTarget: baseConfig.output.libraryTarget,
    //library: 'design-system',
    path: path.resolve(__dirname, 'dist'),
    // filename: 'design-system.js',
    publicPath: 'http://localhost:53219/'
  },
};
config.plugins = baseConfig.plugins.concat([
  new ModuleFederationPlugin({
    name: 'designSystem',
    library: { type: 'amd', name: 'designSystem' },
    filename: 'remoteEntry.js',
    exposes: {
      designSystem: './src/index.fm.ts'
    },
    shared: ["react", "rxjs", "react-dom", "immer"],
  }),
  new CopyPlugin({
    patterns: [
      { from: 'serve.json', to: '.' }
    ]
  })
]);
module.exports = Object.assign({}, baseConfig, config);
