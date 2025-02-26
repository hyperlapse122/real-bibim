import base from './typescript.js';
import react from 'eslint-plugin-react';
import globals from 'globals';

const config = [
  {
    ignores: ['.react-router/*', 'build/*', 'node_modules/*'],
  },
  ...base,
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    plugins: {
      react,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
  },
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
];

export default config;
