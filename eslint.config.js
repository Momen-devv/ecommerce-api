const js = require('@eslint/js');
const prettier = require('eslint-config-prettier');

module.exports = [
  {
    ignores: ['node_modules', 'dist', 'coverage']
  },
  js.configs.recommended,
  prettier,
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly'
      },
      sourceType: 'commonjs'
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: 'req|res|next' }],
      'no-console': 'off',
      'no-undef': 'off',
      'prefer-const': 'warn',
      eqeqeq: 'warn',
      'no-var': 'error',
      'spaced-comment': 'off',
      'callback-return': 'warn',
      'handle-callback-err': 'warn',
      'no-new-require': 'warn',
      'no-path-concat': 'warn'
    }
  }
];
