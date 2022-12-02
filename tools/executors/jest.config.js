module.exports = {
  automock: false,
  verbose: true,
  bail: true,
  testEnvironment: 'node',
  preset: 'ts-jest',
  collectCoverage: true,
  coverageReporters: ['text-summary'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  unmockedModulePathPatterns: ['lodash', 'core-js'],
};
