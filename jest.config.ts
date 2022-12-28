import type { Config } from '@jest/types';

const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

const config: Config.InitialOptions = {
  testResultsProcessor: 'jest-sonar-reporter',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts', '!src/index.ts', '!src/types/**/*.ts', '!src/constants/*.ts', '!src/@types/**/*.d.ts', '!src/config/**/*.ts'],
  coverageDirectory: './coverage',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  projects: [
    {
      displayName: 'Unit',
      testMatch: ['<rootDir>/test/units/**/*.spec.ts'],
      moduleFileExtensions: ['ts', 'js'],
      roots: ['<rootDir>/test', '<rootDir>/src'],
      transform: {
        '^.+\\.(t|j)s$': 'ts-jest'
      },
      testEnvironment: 'node',
      moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' })
    },
    {
      displayName: 'System',
      testMatch: ['<rootDir>/test/system/**/*.spec.ts'],
      moduleFileExtensions: ['ts', 'js'],
      roots: ['<rootDir>/test', '<rootDir>/src'],
      transform: {
        '^.+\\.(t|j)s$': 'ts-jest'
      },
      testEnvironment: 'node',
      moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' })
    },
    {
      displayName: 'Integration',
      testMatch: ['<rootDir>/test/integration/**/*.spec.ts'],
      moduleFileExtensions: ['ts', 'js'],
      roots: ['<rootDir>/test', '<rootDir>/src'],
      transform: {
        '^.+\\.(t|j)s$': 'ts-jest'
      },
      testEnvironment: 'node',
      moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' })
    }
  ],
  testFailureExitCode: 1
};

export default config;
