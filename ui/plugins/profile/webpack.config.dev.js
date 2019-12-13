const baseConfig = require('../../webpack.config.dev');
const path = require('path');

const config = {
  context: path.resolve(__dirname),
};

module.exports = Object.assign({}, baseConfig, config);
