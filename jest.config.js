module.exports = {
  testRegex: '/test/.*\\.test\\.js$',
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: 'test-results/jest' }]
  ],
  collectCoverage: true,
  coverageReporters: ['lcov', 'text']
};
