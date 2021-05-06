module.exports = {
  externals: ['react', 'react-dom', 'rxjs', 'single-spa', '@akashaproject/design-system'],
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
