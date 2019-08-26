const pluginConf = require('./lib/index').default;
const ns = pluginConf.i18nConfig.ns || pluginConf.name;

module.exports = {
  locales: ['en', 'ro'],
  output: '../../../locales/$LOCALE/$NAMESPACE.json',
  saveMissingTo: 'all',
  defaultNamespace: ns,
  useKeysAsDefaultValue: true,
};
