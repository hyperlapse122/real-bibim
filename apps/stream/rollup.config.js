import resolve, {nodeResolve} from '@rollup/plugin-node-resolve';
import nodeExternals from 'rollup-plugin-node-externals';
import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
    input: 'src/index.ts',
    output: {
        dir: 'dist',
        format: 'esm',
        sourcemap: true,
        banner: '#!/usr/bin/env node',
    },
    plugins: [
        nodeResolve({
            extensions: ['.js', '.ts'], // Add .ts if you're using TypeScript
        }),
        nodeExternals({
            exclude: ['@ace-klerk/types'],
        }),
        resolve(),
        commonjs(),
        json(),
        typescript({tsconfig: './tsconfig.json'}),
    ]
};
