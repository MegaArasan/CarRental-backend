const { defineConfig } = require('eslint/config');

const globals = require('globals');
const prettier = require('eslint-plugin-prettier');
const js = require('@eslint/js');

const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

module.exports = defineConfig([
  {
    languageOptions: {
      globals: {
        ...globals.node
      },

      ecmaVersion: 12,
      parserOptions: {}
    },

    extends: compat.extends('eslint:recommended', 'plugin:prettier/recommended'),

    plugins: {
      prettier
    },

    rules: {
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_'
        }
      ],

      'no-console': 'off',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'no-var': 'error',
      'prefer-const': 'warn',
      'comma-dangle': ['error', 'never'],

      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto'
        }
      ]
    }
  }
]);
