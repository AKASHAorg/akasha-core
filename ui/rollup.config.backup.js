import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript';
import json from 'rollup-plugin-json';
import pkg from './package.json';

export default [
  {
    input: 'src/index.ts',
    external: [...Object.keys(pkg.peerDependencies || {}), 'react', 'react-dom'],
    plugins: [
      json(),
      typescript({ typescript: require('typescript'), declaration: true }),
      babel(),
      resolve(),
      commonjs({
        namedExports: {
          'node_modules/react/index.js': ['Component']
        }
      }),
      terser()
    ],
    output: [
      { dir: 'lib/main', format: 'cjs', exports: 'named', sourcemap: true },
      { dir: 'lib/es.module', format: 'es', exports: 'named', sourcemap: true }
    ]
  }
];
