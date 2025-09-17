module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: ['**/*.js', '!**/node_modules/**', '!server.js'],
  setupFiles: ['dotenv/config']
};

