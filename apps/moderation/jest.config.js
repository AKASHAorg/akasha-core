const baseConfig = require('../../jest.config.base');

module.exports = Object.assign(baseConfig, {
  verbose: false,
  roots: [
    "<rootDir>/src"
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
});
