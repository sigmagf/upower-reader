const path = require('path')

/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  preset: 'ts-jest',
  clearMocks: true,
  testEnvironment: 'node',
  rootDir: path.resolve(__dirname),
  coverageProvider: 'babel',
  testMatch: ['<rootDir>/__tests__/**/?(*.)(spec|test).[jt]s'],
  setupFiles: ['<rootDir>/__tests__/setupTests.ts'],
  collectCoverageFrom: ['./src/**/*.[jt]s', '!**/*.d.ts', '!**/node_modules/**', '!**/__tests__/**', '!**/dist/**']
}
