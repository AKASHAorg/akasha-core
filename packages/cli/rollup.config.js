import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript';
import json from 'rollup-plugin-json';
import pkg from './package.json';

export default [
  {
    input: 'src/index.ts',
    external: [],
    plugins: [
      json(),
      resolve(),
      commonjs(),
      typescript(),
      terser()
    ],
    output: [
      { file: pkg.bin['akasha-cli'], format: 'cjs' },
    ]
  }
];
