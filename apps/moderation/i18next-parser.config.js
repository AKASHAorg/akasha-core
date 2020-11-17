const ns = 'moderation-app';

module.exports = {
  useKeysAsDefaultValue: true,
  defaultNamespace: ns,
  output: '../../locales/$LOCALE/$NAMESPACE.json',
  input: './src/**/*.{ts,tsx}',
  locales: ['en'],
  verbose: true,
};
