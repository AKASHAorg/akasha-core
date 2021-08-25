/* eslint-disable @typescript-eslint/no-var-requires */
const baseConfig = require('../../i18next.parser.config');
const package = require('./package.json');
const ns = package.name.split('/')[1];

module.exports = Object.assign(baseConfig, {
  defaultNamespace: ns,
  output: '../../../locales/$LOCALE/$NAMESPACE.json',
  input: ['./src/components/**/*.{ts,tsx}', './src/trending-widget/*.{ts,tsx}'],
});
