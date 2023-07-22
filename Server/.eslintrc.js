module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    indent: [
      'off',
      2,
      { SwitchCase: 1, ignoredNodes: ['ConditionalExpression'], offsetTernaryExpressions: false },
    ],
    'prettier/prettier': [
      'error',
      {
        tabWidth: 2,
      },
    ],
    'linebreak-style': ['error', 'unix'],
    quotes: ['warn', 'single'],
    semi: ['warn', 'always'],
    'object-shorthand': ['warn', 'properties'],
    'no-useless-catch': 'error',
    'no-case-declarations': 'error',
    '@typescript-eslint/naming-convention': [
      'off',
      {
        selector: 'variable',
        format: ['snake_case'],
        filter: {
          regex: '^_id$',
          match: false,
        },
      },
      {
        selector: 'variableLike',
        format: ['snake_case'],
        leadingUnderscore: 'allow',
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
      {
        selector: 'classMethod',
        format: ['camelCase'],
      },
    ],
  },
};
