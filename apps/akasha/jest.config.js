const baseConfig = require('../../jest.config.base');

module.exports = Object.assign(baseConfig, {
  automock: true,
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  preset: "ts-jest/presets/default",
  moduleNameMapper: {
    "@akashaproject/design-system": "<rootDir>../../ui/design/src",
    "@akashaproject/ui-awf-hooks": "<rootDir>../../ui/hooks/src",
    "@akashaproject/ui-awf-typings": "<rootDir>../../ui/typings/src"
  },
});
