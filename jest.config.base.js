// const path = require('path');

module.exports = {
  automock: false,
  verbose: true,
  bail: true,
  testEnvironment: 'node',
  collectCoverage: true,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules',
    '<rootDir>/__tests__/__mocks__',
    '<rootDir>/e2e',
    '<rootDir>/lib',
    '<rootDir>/dist',
  ],
  transform: {
    '\\.[jt]sx?|mjs$': ['babel-jest', { rootMode: 'upward' }],
  },
  transformIgnorePatterns: ['<rootDir>/sdk/'],
  coverageReporters: ['text-summary'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  unmockedModulePathPatterns: ['lodash', 'core-js'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
};
