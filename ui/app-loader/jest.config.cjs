// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require('../../jest.config.base');

module.exports = Object.assign(baseConfig, {
  verbose: true,
  bail: true,
  preset: 'ts-jest',
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?|ts?)$',
  testEnvironment: 'jsdom',
  collectCoverage: true,
  setupFiles: ['./jest.setup.js'],
  coverageReporters: ['text-summary'],
});
