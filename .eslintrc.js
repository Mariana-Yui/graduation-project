module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        'plugin:vue/essential',
        'eslint:recommended',
        '@vue/typescript/recommended',
        '@vue/prettier',
        '@vue/prettier/@typescript-eslint'
    ],
    parserOptions: {
        ecmaVersion: 2020
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-var': 'error',
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
        indent: ['error', 4],
        'linebreak-style': ['error', 'unix'],
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        eqeqeq: ['error', 'smart'],
        'no-eq-null': 0,
        'no-param-reassign': 0,
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/no-unused-vars': 0,
        '@typescript-eslint/camelcase': 0,
        '@typescript-eslint/no-this-alias': 0,
        '@typescript-eslint/no-empty-function': 0
    }
};
