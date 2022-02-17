module.exports = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      babelConfig: true,
    },
  },
  testMatch: ['<rootDir>/src/**/**.test.{ts,tsx}'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  moduleFileExtensions: ['js', 'tsx'],
  modulePaths: ['<rootDir>'],
  testURL: 'http://localhost',
  setupFilesAfterEnv: ['<rootDir>/setupTest.ts'],
  moduleDirectories: ['node_modules', './src'],
  notify: true,
  notifyMode: 'always',
  collectCoverageFrom: ['**/*.{ts,tsx}', '!<rootDir>/node_modules/'],
  testEnvironment: 'jsdom',
}
