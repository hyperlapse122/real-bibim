import {nodeResolve} from '@rollup/plugin-node-resolve';
import nodeExternals from 'rollup-plugin-node-externals';
import tsConfigPaths from "rollup-plugin-tsconfig-paths";
import esbuild from 'rollup-plugin-esbuild';

export default {
    input: 'src/index.ts',
    output: {
        dir: 'dist',
        format: 'esm',
        sourcemap: true,
        banner: '#!/usr/bin/env node'
    },
    plugins: [
        tsConfigPaths(),
        // typescript(),
        nodeResolve(),
        nodeExternals(),
        // terser(),
        esbuild({
            target: 'esnext',     // Set the target to 'esnext'
            sourceMap: true,      // Enable sourcemaps
            minify: true,         // Enable minification --minification increases the build time sometimes
            tsconfig: './tsconfig.json',
        }),
    ]
};
