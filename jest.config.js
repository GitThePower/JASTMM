module.exports = {
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/test/'
  ],
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.ts'],

  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};
