module.exports = {
  externals: [
    {
      '@akashaproject/design-system': '@akashaproject/design-system',
    },
    {
      '@akashaproject/awf-sdk': '@akashaproject/awf-sdk',
    },
    {
      '@akashaproject/ui-awf-hooks': '@akashaproject/ui-awf-hooks',
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
