/** @type {import('ts-jest').JestConfigWithTsJest} */
const { defaults: tsjests } = require('ts-jest');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/src/tests/polyfills.ts'],
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/tests/mocks/fileMock.js',
    '^.*\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/tests/mocks/fileMock.js',
  },
  automock: false,
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/tests/**',
  ],
  coverageDirectory: 'coverage',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'jest.tsconfig.json',
    }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(uuid|msw)/)',
    '\.(jpg|jpeg|png|gif|webp|svg)$',
  ],
  verbose: true,
  clearMocks: true,
  restoreMocks: true,
};
