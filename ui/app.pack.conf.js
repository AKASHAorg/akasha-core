module.exports = {
  externals: [
    {
      react: 'React',
      'react-dom': 'ReactDOM',
      'styled-components': 'styled',
      rxjs: 'rxjs',
      '@akashaproject/design-system': 'akashaproject__design_system',
    },
  ],
  optimization: {
    moduleIds: 'deterministic',
    chunkIds: 'named',
    splitChunks: {
      chunks: 'all',
      minSize: 69000,
      minChunks: 2,
    },
  },
};
