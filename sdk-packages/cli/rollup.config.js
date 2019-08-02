import typescript from 'rollup-plugin-typescript';
import pkg from './package.json';

export default [
  {
    input: 'src/index.ts',
    external: [],
    plugins: [
      typescript({typescript: require('typescript')})
    ],
    output: [
      { file: pkg.bin['akasha-cli'], format: 'cjs' },
    ]
  }
];
