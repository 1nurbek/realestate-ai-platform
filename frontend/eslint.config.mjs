export default [
  {
    ignores: ['.next/**', 'node_modules/**'],
  },
  {
    files: ['**/*.{js,mjs,ts,tsx}'],
    rules: {
      'no-console': 'off',
    },
  },
];