const path = require('path');
// must specify this
// can't use import from lib/ because it breaks the parser
const ns = 'ui-plugin-profile';

module.exports = {
  locales: ['en', 'ro'],
  saveMissingTo: 'all',
  defaultNamespace: ns,
};
