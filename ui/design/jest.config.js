const baseConfig = require('../../jest.config.base');

module.exports = Object.assign(baseConfig, {
  automock: false,
  preset: 'ts-jest/presets/js-with-babel-esm',
  testEnvironment: 'jsdom',
});
