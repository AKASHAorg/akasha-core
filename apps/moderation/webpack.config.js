const path = require('path');
const baseConfig = require('../../ui/webpack.config');

const config = {
  context: path.resolve(__dirname),
  output: {
    libraryTarget: baseConfig.output.libraryTarget,
    //library: 'moderation-app-ewa',
    path: path.resolve(__dirname, 'dist'),
    filename: 'moderation-app.js',
    publicPath: '/apps/',
  },
};

module.exports = Object.assign({}, baseConfig, config);
