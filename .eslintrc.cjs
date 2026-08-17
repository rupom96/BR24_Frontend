module.exports = {
  root: true,
  env: { browser: true, es2021: true },
  extends: [
    "airbnb",
    'airbnb-typescript',
    'airbnb/hooks',
    // 'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: '12',
    sourceType: 'module',
    project: './tsconfig.json'
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'prettier',
    'react-refresh'
  ],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/react-in-jsx-scope': 0,
    'react/require-default-props':0,
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/no-explicit-any':0,
    'prefer-destructuring': 0,
    'react/prop-types':0,
    // 'react/jsx-one-expression-per-line': ['error', { allow: 'single-child' }],
    'import/extensions': 0,
    "prettier/prettier": [
      "error",
      {
        "endOfLine": "auto"
      }
    ],
    "react/function-component-definition": [
      2,
      {
        // namedComponents: "function-declaration",
        // namedComponents: ['arrow-function', 'function-declaration'],
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    "jsx-a11y/label-has-associated-control": ["error", {
      "required": {
        "some": ["nesting", "id"]
      }
    }],
    "jsx-a11y/label-has-for": ["error", {
      "required": {
        "some": ["nesting", "id"]
      }
    }],
  },
}
