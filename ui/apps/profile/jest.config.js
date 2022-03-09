const baseConfig = require('../../../jest.config.base');

module.exports = Object.assign(baseConfig, {
  automock: false,
  preset: 'ts-jest/presets/js-with-babel-esm',
  transform: {
    '\\.[jt]sx?$': 'ts-jest',
  },
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      useESM: true,
      babelConfig: '../../../babel.config.js',
      tsconfig: '../../../tsconfig.json',
    },
  },
});
