import tseslint from 'typescript-eslint';
import baseConfig from './base.js';

const config = [
  ...tseslint.config(...baseConfig, tseslint.configs.strict),
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
];

export default config;
