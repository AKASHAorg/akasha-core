const path = require('path');
const baseConfig = require('../../webpack.config');

const config = {
  context: path.resolve(__dirname),
  output: {
    libraryTarget: baseConfig.output.libraryTarget,
    //library: 'ui-plugin-events',
    path: path.resolve(__dirname, 'dist'),
    filename: 'events.js',
    publicPath: '/plugins/',
  },
};

module.exports = Object.assign({}, baseConfig, config);
