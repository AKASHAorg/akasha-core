const path = require('path');
const baseConfig = require('../../webpack.config');

const config = {
  context: path.resolve(__dirname),
  output: {
    libraryTarget: baseConfig.output.libraryTarget,
    // library: 'ui-widget-sidebar',
    path: path.resolve(__dirname, 'dist'),
    filename: 'layout.js',
    publicPath: '/widgets/',
  },
};

module.exports = Object.assign({}, baseConfig, config);
