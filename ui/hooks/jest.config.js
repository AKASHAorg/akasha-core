const baseConfig = require('../../jest.config.base');

module.exports = Object.assign(baseConfig, {
  automock: false,
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  preset: "ts-jest",
  moduleNameMapper: {
    "@akashaproject/ui-awf-typings": "<rootDir>../../ui/typings/src",
    "react": "<rootDir>../../node_modules/react"
  },
});
