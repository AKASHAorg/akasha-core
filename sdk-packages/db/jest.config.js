module.exports = {
  verbose: true,
  bail: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageReporters: ['text-summary'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  testMatch: ['<rootDir>/__tests__/**/*.[jt]s?(x)', '<rootDir>/**/?(*.)+(spec|test).[jt]s?(x)'],
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.json',
    },
  },
};
