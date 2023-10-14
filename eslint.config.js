import ava from '@jgarber/eslint-config/ava';
import config from '@jgarber/eslint-config';

export default [
  {
    ignores: ['coverage', 'dist']
  },
  ...config,
  ...ava,
  {
    files: ['src/*.js'],
    languageOptions: {
      globals: {
        window: 'readonly'
      }
    }
  },
  {
    files: ['test/*.js'],
    rules: {
      'regexp/no-super-linear-backtracking': 'off'
    }
  }
];
