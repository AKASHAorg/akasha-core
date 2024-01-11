module.exports = {
  externals: [
    {
      '@akashaorg/awf-sdk': '@akashaorg/awf-sdk',
    },
    {
      '@akashaorg/ui-awf-hooks': '@akashaorg/ui-awf-hooks',
    },
    {
      'single-spa': 'single-spa',
    },
    {
      'single-spa-react': 'single-spa-react',
    },
    function ({ request }, callback) {
      if (/^rxjs\/operators$/.test(request)) {
        return callback(null, ['rxjs', 'operators'], 'root');
      }
      if (/^rxjs$/.test(request)) {
        return callback(null, 'rxjs', 'root');
      }
      if (/^react-dom$/.test(request)) {
        return callback(null, 'ReactDOM', 'root');
      }

      if (/^react$/.test(request)) {
        return callback(null, 'React', 'root');
      }

      if (/^@tanstack\/react-query$/.test(request)) {
        return callback(null, 'ReactQuery', 'root');
      }
      if (/^@twind\/core$/.test(request)) {
        return callback(null, 'twind', 'root');
      }
      if (/^systemjs$/.test(request)) {
        return callback(null, 'System', 'root');
      }

      callback();
    },
  ],
  optimization: {
    moduleIds: 'deterministic',
    chunkIds: 'named',
    splitChunks: {
      chunks: 'async',
      minSize: 69000,
      minChunks: 2,
    },
  },
};
