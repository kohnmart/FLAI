module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
  plugins: ['prettier'],
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  globals: {
    module: false,
  },
  rules: {
    indent: ['error', 2],
    'no-multiple-empty-lines': 'warn',
    camelcase: ['error', { properties: 'never' }], // Checks for lowerCamelCase, except for property names (db compatibility)
    quotes: ['error', 'single'],
    'no-var': 'error',
    'prefer-const': [
      'error',
      {
        destructuring: 'all', // Checks for destructured variables, where all should be const. Can be changed to "any"
        ignoreReadBeforeAssign: false,
      },
    ],
    'no-use-before-define': 'error',
    eqeqeq: [
      'error',
      'always',
      {
        null: 'ignore',
      },
    ],
    'prettier/prettier': 'error',
  },
}
