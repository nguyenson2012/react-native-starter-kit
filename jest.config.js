module.exports = {
  preset: '@testing-library/react-native',
  transformIgnorePatterns: ['/node_modules/(?!native-base)/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: true,
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'html'],
  setupFilesAfterEnv: [
    '@testing-library/react-native/cleanup-after-each',
    '<rootDir>/jest.ignore_yellow_box_warning.js',
    // ... other setup files ...
  ],
};
