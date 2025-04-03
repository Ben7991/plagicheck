/** @type {import('ts-jest').JestConfigWithTsJest} **/

export default {
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
      },
    ],
  },
  preset: 'ts-jest',
  moduleNameMapper: {
    '^@util/(.*)$': '<rootDir>/src/util/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@store/(.*)$': '<rootDir>/src/store/$1',
    '^@pages/(.*)$': '<rootDir>/src/pages/$1',
  },
};
