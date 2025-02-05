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
};
