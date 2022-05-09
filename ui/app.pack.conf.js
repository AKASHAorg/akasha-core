module.exports = {
  externals: [
    {
      '@akashaorg/design-system': '@akashaorg/design-system',
    },
    {
      '@akashaorg/awf-sdk': '@akashaorg/awf-sdk',
    },
    {
      '@akashaorg/ui-awf-hooks': '@akashaorg/ui-awf-hooks',
    },
    function ({ request }, callback) {
      if (/^rxjs\/operators$/.test(request)) {
        return callback(null, ['rxjs', 'operators'], 'root');
      }
      if (/^rxjs$/.test(request)) {
        return callback(null, 'rxjs', 'root');
      }
      if (/^single-spa-react$/.test(request)) {
        return callback(null, 'singleSpaReact', 'root');
      }
      if (/^single-spa$/.test(request)) {
        return callback(null, 'singleSpa', 'root');
      }

      if (/^react-dom$/.test(request)) {
        return callback(null, 'ReactDOM', 'root');
      }

      if (/^react$/.test(request)) {
        return callback(null, 'React', 'root');
      }

      if (/^react-query$/.test(request)) {
        return callback(null, 'ReactQuery', 'root');
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
