module.exports = {
  externals: [
    /^@akashaproject\/design-system$/,
    /^react$/,
    /^react-dom$/,
    /^react-i18next$/,
    /^react-router-dom$/,
    /^immer$/,
    /// ^react-tracked$/,
    /// ^single-spa-react$/,
  ],
  optimization: {
    splitChunks: {
      chunks: 'async',
      minChunks: 3,
    },
  },
};
