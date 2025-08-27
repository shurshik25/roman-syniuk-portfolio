module.exports = {
  root: true,
  env: { 
    browser: true, 
    es2020: true, 
    node: true,
    jest: true
  },
  globals: {
    vi: 'readonly',
    expect: 'readonly',
    describe: 'readonly',
    it: 'readonly',
    beforeEach: 'readonly',
    afterEach: 'readonly',
    beforeAll: 'readonly',
    afterAll: 'readonly',
    global: 'readonly',
    __dirname: 'readonly',
    process: 'readonly'
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: [
    'dist', 
    '.eslintrc.cjs',
    'node_modules',
    'build',
    'coverage',
    'public',
    '*.config.js'
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.3' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': 'off',
    'no-unused-vars': 'warn',
    'react/no-unescaped-entities': 'warn',
    'no-prototype-builtins': 'warn',
    'react-hooks/exhaustive-deps': 'warn'
  },
}
