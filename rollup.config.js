import packageJson from './package.json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import ts from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { dts } from 'rollup-plugin-dts';
import tsConfigPaths from 'rollup-plugin-tsconfig-paths';
import istanbul from 'rollup-plugin-istanbul';

export default [
    {
        plugins: [
            ts(),
            terser({
                output: {
                    comments: false
                }
            })
        ],
        input: 'src/index.ts',
        output: [
            {
                file: packageJson.exports['.'].require.default,
                format: 'cjs'
            },
            {
                file: packageJson.exports['.'].import.default,
                format: 'esm'
            }
        ],
        external: ['shadow-dom-selector']
    },
    {
        plugins: [
            tsConfigPaths(),
            dts()
        ],
        input: 'src/index.ts',
        output: [
            {
                file: packageJson.exports['.'].require.types,
                format: 'cjs'
            },
            {
                file: packageJson.exports['.'].import.types,
                format: 'esm'
            }
        ]
    },
    {
        plugins: [
            nodeResolve(),
            ts({
                compilerOptions: {
                    outDir: undefined,
                    removeComments: false
                }
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