module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-console': 0,
    'class-methods-use-this': 0,
    'import/first': 0,
    'arrow-body-style': 0,
    'no-param-reassign': 0,
    'no-plusplus': 0,
    camelcase: 0,
    'no-unused-vars': 0,
  },
};
