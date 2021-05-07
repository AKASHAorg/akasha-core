const baseConfig = require('../../jest.config.base');

module.exports = Object.assign(baseConfig, {
  automock: false,
  transform: {
    "^.(tsx?|ts?|js?)$": "ts-jest",
  },
  preset: "ts-jest",
  testEnvironment: "jsdom",
});
