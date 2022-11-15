export default {
    collectCoverageFrom: ['src/**/*.js'],
    testMatch: ['<rootDir>/test/**/(*.)test.js'],
    coverageThreshold: { global: { statements: 100, branches: 100, functions: 100, lines: 100 } },
    coverageDirectory: '<rootDir>/build/coverage',
    setupFilesAfterEnv: ['<rootDir>/test/setupTests.js'],
    transform: { "\\.(js|jsx|ts|tsx)$": "@sucrase/jest-plugin" },
};
