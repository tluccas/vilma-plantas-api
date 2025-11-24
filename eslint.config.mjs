import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';
import json from '@eslint/json';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended', prettier],
    languageOptions: { globals: globals.node },
    rules: {
      semi: ['error', 'always'],
    },
  },
  {
    files: ['**/*.json'],
    plugins: { json },
    language: 'json/json',
    extends: ['json/recommended'],
  },
]);
