const baseConfig = require('../../../jest.config.base');

module.exports = Object.assign(baseConfig, {
  automock: false,
  testPathIgnorePatterns: [...baseConfig.testPathIgnorePatterns],
  testEnvironment: 'jsdom',
});
