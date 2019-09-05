module.exports = {
  verbose: true,
  bail: true,
  preset: 'ts-jest',
  collectCoverage: true,
  coverageReporters: ['text-summary'],
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.json',
    },
  },
};
