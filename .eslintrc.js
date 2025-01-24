module.exports = {
    // Set the environment for Node.js (or browser, etc.)
    env: {
        node: true,
        es6: true,
    },
    extends: [
        'eslint:recommended', // Use ESLint's recommended rules
        'plugin:prettier/recommended', // Integrate Prettier with ESLint
    ],
    parserOptions: {
        ecmaVersion: 2021, // Use ECMAScript 2021 features
        sourceType: 'module', // Allow ES Modules
    },
    rules: {
        // ESLint custom rules can go here
        'no-console': 'warn', // Warn if console.log is used
        semi: ['error', 'always'], // Enforce semicolons
        quotes: ['error', 'single'], // Enforce single quotes
        'prettier/prettier': 'error', // Make Prettier errors as ESLint errors
    },
};
