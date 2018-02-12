module.exports = {
  rootDir: '../..',
  setupFiles: ['<rootDir>/config/jest/setup.js'],
  setupTestFrameworkScriptFile: '<rootDir>/config/jest/setup-test-framework-script.js',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/', '\..*@neomake'],
};
