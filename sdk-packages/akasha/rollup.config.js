import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import json from 'rollup-plugin-json';

export default [
  {
    input: 'lib/index.js',
    treeshake: true,
    output: [
      {
        file: 'dist/sdk.esm.js',
        format: 'esm',
        sourcemap: true,
        dynamicImportFunction: 'importShim',
        banner: 'AKASHA SDK',
      },
      {
        file: 'dist/sdk.umd.js',
        format: 'umd',
        name: 'akasha-sdk',
        sourcemap: true,
        dynamicImportFunction: 'importShim',
        banner: 'AKASHA SDK',
      },
    ],
    plugins: [
      json({ preferConst: true }),
      resolve({ browser: true, preferBuiltins: true }),
      commonjs(),
      terser(),
    ],
  },
];
