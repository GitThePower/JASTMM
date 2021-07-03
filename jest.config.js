module.exports = {
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/test/'
  ],
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.*'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};
