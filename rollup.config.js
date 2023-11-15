import ts from 'rollup-plugin-ts';
import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    plugins: [
        nodeResolve(),
        ts({
            browserslist: false
        }),
        terser({
            output: {
                comments: false
            }
        })
    ],
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/index.js',
            format: 'cjs',
        },
        {
            file: 'dist/esm/index.js',
            format: 'esm'
        }
    ]
};