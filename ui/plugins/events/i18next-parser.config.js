const ns = 'ui-plugin-events';

module.exports = {
  locales: ['en', 'ro'],
  input: ['./src/components/**/*.tsx'],
  output: '../../../locales/$LOCALE/$NAMESPACE.json',
  saveMissingTo: 'all',
  defaultNamespace: ns,
  useKeysAsDefaultValue: true,
};
