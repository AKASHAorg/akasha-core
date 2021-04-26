const path = require('path');
const mainTsConfig = require('./tsconfig.json');

module.exports = {
  automock: false,
  verbose: true,
  bail: true,
  testEnvironment: 'node',
  // preset: 'ts-jest/presets/default-esm',
  collectCoverage: true,
  setupFiles: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/__tests__/__mocks__', '<rootDir>/lib', '<rootDir>/dist'],
  coverageReporters: ['text-summary'],
  globals: {
    'ts-jest': {
      tsconfig: {
        ...mainTsConfig.compilerOptions,
        module: 'commonjs'
      },
      useESM: true
    },
  },
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  unmockedModulePathPatterns: [
    "lodash",
    "core-js",
  ]
};
