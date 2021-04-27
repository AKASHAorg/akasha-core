const baseConfig = require('../../jest.config.base');

module.exports = Object.assign(baseConfig, {
  automock: false,
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?|ts?)$",
  preset: "ts-jest",
  testEnvironment: "jsdom"
});
