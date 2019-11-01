module.exports = {
  'env': {
    'browser': true,
    'es6': true,
    'jest/globals': true
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true
    },
    'ecmaVersion': 2018,
    'sourceType': 'module'
  },
  'plugins': [
    'react',
    'jest',
  ],
  'rules': {
    'react/jsx-uses-vars': 1
  }
};