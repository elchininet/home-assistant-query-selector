import ts from 'rollup-plugin-ts';
import serve from 'rollup-plugin-serve';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    plugins: [
        nodeResolve(),
        ts(),
        serve({
            open: false,
            contentBase: [
                'demo/'
            ],
            host: 'localhost',
            port: 3000,
        })
    ],
    input: 'src/index.ts',
    output: [
        {
            file: 'demo/demo.js',
            format: 'iife'
        }
    ]
};