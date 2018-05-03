module.exports = {
  env: {
    // ESLint sources globals from https://github.com/sindresorhus/globals/blob/master/globals.json
    browser: true,
  },
  extends: [
    // Lint against AirBnB styles, https://github.com/airbnb/javascript
    'airbnb-base',
    // Allow Prettier to override AirBnB wherever they conflict.
    // See https://github.com/prettier/eslint-config-prettier
    'prettier',
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'es5',
      },
    ],
    'no-console': 'warn',
  },
};
