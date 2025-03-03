import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import typescriptConfig from '@real-bibim/eslint-config/typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      'dist/*',
      'node_modules/*',
      'common/lib/utils.ts',
      'common/lib/hooks/*',
      'common/components/*',
    ],
  },
  ...typescriptConfig,
  ...compat.extends('plugin:@next/next/core-web-vitals'),
];

export default eslintConfig;
