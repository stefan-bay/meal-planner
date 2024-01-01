module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ['standard-with-typescript', 'prettier'],
    overrides: [
        {
            env: {
                node: true,
            },
            files: ['.eslintrc.{js,cjs}'],
            parserOptions: {
                sourceType: 'script',
            },
        },
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
        '@typescript-eslint/semi': ['error', 'always'],
        '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
        '@typescript-eslint/unbound-method': ['off'],
        '@typescript-eslint/member-ordering': 'error',
        '@typescript-eslint/strict-boolean-expressions': 'off',
        quotes: ['error', 'single'],
    },
};
