// const path = require('path');
// const mainTsConfig = require('./tsconfig.json');

module.exports = {
  automock: false,
  verbose: true,
  bail: true,
  testEnvironment: 'node',
  preset: 'ts-jest/presets/js-with-babel-esm',
  collectCoverage: true,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules',
    '<rootDir>/__tests__/__mocks__',
    '<rootDir>/lib',
    '<rootDir>/dist',
  ],
  coverageReporters: ['text-summary'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  unmockedModulePathPatterns: ['lodash', 'core-js'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
};
