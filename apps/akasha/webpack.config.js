const path = require('path');
const baseConfig = require('../../ui/webpack.config');

const config = {
  context: path.resolve(__dirname),
  output: {
    libraryTarget: baseConfig.output.libraryTarget,
    //library: 'akasha-app-ewa',
    path: path.resolve(__dirname, 'dist'),
    filename: 'akasha-app.js',
    publicPath: '/apps/',
  },
};

module.exports = Object.assign({}, baseConfig, config);
