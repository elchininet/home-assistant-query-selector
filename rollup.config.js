import ts from 'rollup-plugin-ts';
import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import istanbul from 'rollup-plugin-istanbul';
import tsconfig from './tsconfig.json';

export default [
    {
        plugins: [
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
                format: 'cjs'
            },
            {
                file: 'dist/esm/index.js',
                format: 'esm'
            }
        ],
        external: ['shadow-dom-selector']
    },
    {
        plugins: [
            nodeResolve(),
            ts({
                tsconfig: {
                    ...tsconfig.compilerOptions,
                    declaration: false
                },
                browserslist: false
            }),
            istanbul({
                exclude: [
                    'node_modules/**/*'
                ]
            }),
        ],
        input: 'src/index.ts',
        output: [
            {
                file: '.hass/config/www/home-assistant-query-selector.js',
                format: 'umd',
                name: 'HAQuerySelectorBundle'
            }
        ]
    }
];