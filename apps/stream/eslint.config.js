import typescriptConfig from '@real-bibim/eslint-config/typescript';

const config = [
  {
    ignores: ['dist/*', 'node_modules/*'],
  },
  ...typescriptConfig,
];

export default config;
