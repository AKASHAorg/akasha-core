const baseConfig = require('../../../playwright.config.base.ts');

module.exports = {
  testDir: './e2e',
  ...baseConfig,
};
