const path = require('path');
const baseConfig = require('../../ui/webpack.config');

const config = {
  context: path.resolve(__dirname),
  output: {
    libraryTarget: baseConfig.output.libraryTarget,
    //library: '3box-app-ewa',
    path: path.resolve(__dirname, 'dist'),
    filename: '3box-app.js',
    publicPath: '/apps/',
  },
};

module.exports = Object.assign({}, baseConfig, config);
