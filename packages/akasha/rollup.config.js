import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript';
import json from 'rollup-plugin-json';
import pkg from './package.json';

export default [
  {
    input: 'src/index.ts',
    output: {
      name: 'akasha-sdk',
      file: pkg.browser,
      format: 'umd',
      sourcemap: true
    },
    plugins: [
      json(),
      resolve(),
      commonjs(),
      typescript(),
      terser()
    ]
  },
  {
    input: 'src/index.ts',
    external: [],
    plugins: [
      typescript()
    ],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ]
  }
];
