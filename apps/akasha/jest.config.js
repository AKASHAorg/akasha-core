const baseConfig = require('../../jest.config.base');

module.exports = Object.assign(baseConfig, {
  automock: false,
  transform: {
    "^.(tsx?|ts?|js?)$": "ts-jest",
  },
  testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?|ts?)$",
  preset: "ts-jest",

  moduleNameMapper: {
    "@akashaproject/design-system": "<rootDir>../../ui/design/src",
    "@akashaproject/ui-awf-hooks": "<rootDir>../../ui/hooks/src",
    "@akashaproject/ui-awf-typings": "<rootDir>../../ui/typings/src"
  },
});
