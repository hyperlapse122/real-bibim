import tseslint from 'typescript-eslint';
import baseConfig from './base.js';

const config = tseslint.config(...baseConfig, tseslint.configs.strict);

export default config;
