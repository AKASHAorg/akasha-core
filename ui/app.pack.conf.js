module.exports = {
  externals: [
    /^@akashaproject\/design-system$/,
    /^react$/,
    /^react-dom$/,
    /^react-i18next$/,
    /^react-router-dom$/,
    /^immer$/,
    /^rxjs$/,
    /^rxjs\/operators$/,
    {
      'single-spa-react': 'single-spa-react'
    }

  ],
  optimization: {}
};
