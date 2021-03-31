const baseConfig = require('../../i18next.parser.config');
const ns = 'ui-widget-feed';

module.exports = Object.assign(baseConfig, {
  defaultNamespace: ns,
  output: '../../../locales/$LOCALE/$NAMESPACE.json',
  input: './src/components/*.{ts,tsx}',
});
