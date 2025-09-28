module.exports = {
  env: {
    node: true, // Node.js global variables
    es2021: true // Modern JS features
  },
  parserOptions: {
    ecmaVersion: 12 // ES2021
  },
  extends: [
    'eslint:recommended', // Recommended ESLint rules
    'plugin:prettier/recommended' // Integrates Prettier
  ],
  plugins: ['prettier'],
  rules: {
    // General rules
    'no-unused-vars': 'warn', // Warn about unused variables
    'no-console': 'off', // Allow console.log for now
    'prettier/prettier': 'error', // Ensure Prettier formatting
    eqeqeq: ['error', 'always'], // Enforce === and !==
    curly: ['error', 'all'], // Always use braces
    'no-var': 'error', // Prefer let/const over var
    'prefer-const': 'warn', // Suggest const if not reassigned
    'comma-dangle': ['error', 'never'] // No dangling commas
  }
};
