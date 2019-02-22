module.exports = {
  extends: 'airbnb-base',
  rules: {
    'no-console': ['error', { allow: ['info', 'warn', 'error'] }],// TODO - REACTIVATE BEFORE LINT TEST
    // 'no-console': ['error', { allow: ['info', 'warn', 'error', 'log'] }], // TODO - REMOVE
    'linebreak-style': 0
    // 'no-unused-vars': 0 // TODO - REMOVE
  },
  plugins: ['import'],
};
