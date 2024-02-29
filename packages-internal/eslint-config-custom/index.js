/**
 * @type {import('eslint').Linter.Config}
 */
// eslint-disable-next-line no-undef
module.exports = {
  extends: ['turbo', 'prettier', 'eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'eslint-plugin-unicorn'],
  ignorePatterns: ['*.gen.ts'],
  root: true,
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_', // Ignore unused variables whose name starts with `_`
      },
    ],
    'unicorn/filename-case': [
      'error',
      {
        case: 'kebabCase',
      },
    ],
  },
};
