'use strict';

module.exports = {
    "root": true,
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:@typescript-eslint/strict"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": { 
        "project": "./tsconfig.json",
        "ecmaFeatures": {
            "jsx": true
        },
        tsconfigRootDir: __dirname
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "settings": {
        "react": {
            "version": "detect"
        }
    },
    "rules": {
        "indent": ["error", "tab"],
        "camelcase": "error",
        "spaced-comment": "error",
        "quotes": ["error", "single"],
        "react/react-in-jsx-scope": "off",
        "no-duplicate-imports": "error",
        "react/jsx-uses-react": "error",
        "react/jsx-uses-vars": "error",
        "semi": "error"
    },
    "ignorePatterns": [
        "src/**/*.test.ts",
        "src/frontend/generated/*",
        ".eslintrc.cjs"
    ]
};