module.exports = {
  externals: [
    {
      react: 'react',
      rxjs: 'rxjs',
      'react-dom': 'react-dom',
      // 'styled-components': 'styled',
      // '@akashaproject/design-system': 'akashaproject__design_system',
    },
    '@akashaproject/design-system',
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
