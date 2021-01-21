const baseConfig = require('../../ui/i18next.parser.config');
const ns = 'moderation-app';

module.exports = Object.assign(baseConfig, {
  defaultNamespace: ns,
  output: '../../locales/$LOCALE/$NAMESPACE.json',
  input: './src/components/**/*.{ts,tsx}',
});
