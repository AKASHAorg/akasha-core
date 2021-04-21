const baseConfig = require('../../jest.config.base');

module.exports = Object.assign(baseConfig, {
  automock: false,
  verbose: false,
  transform: {
    "^.(tsx?|ts?)$": "ts-jest",
  },
  testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?|ts?)$",
  preset: "ts-jest",
  testEnvironment: "jsdom",
  // globals: {
  //   'ts-jest': {
  //     useESM: true
  //   }
  // },
  // extensionsToTreatAsEsm: ['.ts', '.js'],
  // moduleNameMapper: {
  //   "@akashaproject/design-system": "<rootDir>../../ui/design/src",
  //   "@akashaproject/ui-awf-hooks": "<rootDir>../../ui/hooks/src",
  //   "@akashaproject/ui-awf-typings": "<rootDir>../../ui/typings/src",
  //   "@akashaproject/ui-awf-testing-utils": "<rootDir>../../ui/testing-utils/src"
  // },
});
