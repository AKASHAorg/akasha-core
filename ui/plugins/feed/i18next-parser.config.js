const path = require('path');
const ns = 'ui-plugin-feed';

module.exports = {
  locales: ['en', 'ro'],
  input: path.resolve('./src/components/**/*.tsx'),
  output: path.resolve('../../../locales/$LOCALE/$NAMESPACE.json'),
  saveMissingTo: 'all',
  defaultNamespace: ns,
  useKeysAsDefaultValue: true,
};
