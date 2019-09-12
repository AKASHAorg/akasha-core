module.exports = {
  verbose: true,
  bail: true,
  preset: 'ts-jest',
  collectCoverage: true,
  setupFiles: ['./jest.setup.js'],
  coverageReporters: ['text-summary'],
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.json',
    },
  },
};
