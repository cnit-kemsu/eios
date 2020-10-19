module.exports = {
    "env": {
        "node": true,
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly",
        "System": "readonly"
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2020,
        "sourceType": "module"
    },
    "parser": "babel-eslint",
    "plugins": [
        "react",
        "react-hooks"
    ],
    "rules": {
        "react/jsx-uses-react": 1,
        "react/jsx-uses-vars": 1,
        "react/react-in-jsx-scope": 1,
        "no-unused-vars": 1,
        "react-hooks/rules-of-hooks": 1,
        "react-hooks/exhaustive-deps": 1,
        "no-empty": ["error", {
            "allowEmptyCatch": true
        }]
    }
};