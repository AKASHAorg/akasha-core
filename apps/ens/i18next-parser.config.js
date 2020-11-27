const baseConfig = require('../../ui/i18next.parser.config');
const ns = 'ens-app';

module.exports = Object.assign(baseConfig, {
  defaultNamespace: ns,
  output: '../../locales/$LOCALE/$NAMESPACE.json',
  input: './src/**/*.{ts,tsx}',
  locales: ['en'],
  verbose: true,
});
