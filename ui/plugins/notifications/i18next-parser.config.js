const baseConfig = require('../../i18next.parser.config');
const ns = 'ui-plugin-notifications';

module.exports = Object.assign(baseConfig, {
  defaultNamespace: ns,
  output: '../../../locales/$LOCALE/$NAMESPACE.json',
  input: './src/components/**/*.{ts,tsx}',
});
