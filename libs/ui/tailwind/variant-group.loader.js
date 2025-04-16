/* eslint-disable @typescript-eslint/no-var-requires */
const { parse } = require('./parse.cjs');
const { expandVariantGroup } = require('./expand-variant-group.cjs');

module.exports = function (source) {
  return expandVariantGroup(source, match => {
    return parse(match);
  });
};
