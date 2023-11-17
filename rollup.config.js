import ts from 'rollup-plugin-ts';
import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import istanbul from 'rollup-plugin-istanbul';

export default [
    {
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
            },
            {
                file: 'dist/test/index.js',
                format: 'iife',
                name: 'HomeAssistantQuerySelector'
            }
        ]
    },
    {
        plugins: [
            nodeResolve(),
            ts({
                browserslist: false
            }),
            istanbul({
                exclude: [
                    'test/index.ts',
                    'node_modules/**/*'
                ]
            }),
        ],
        input: 'test/index.ts',
        output: [
            {
                file: 'test/index.js',
                format: 'iife',
                name: 'HAQuerySelector'
            }
        ]
    }
];