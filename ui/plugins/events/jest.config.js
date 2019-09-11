module.exports = {
  automock: true,
  verbose: true,
  bail: true,
  preset: 'ts-jest',
  collectCoverage: true,
  setupFiles: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/__tests__/__mocks__'],
  coverageReporters: ['text-summary'],
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.json',
    },
  },
  moduleNameMapper: {
    'react-i18next': '<rootDir>/__mocks__/react-i18next.js',
  },
};
