require('../src/twind/main.css');
var install = require('@twind/with-react').install;
var config = require('../src/twind/twind.config.cjs');

install(config);

module.exports.parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
