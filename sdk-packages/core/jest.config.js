module.exports = {
  verbose: true,
  bail: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageReporters: ['text-summary'],
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.json',
    },
  },
};
