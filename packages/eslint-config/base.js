import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

const config = [eslint.configs.recommended, eslintPluginPrettierRecommended];

export default config;
