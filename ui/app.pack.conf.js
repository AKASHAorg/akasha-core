module.exports = {
  externals: [{
    'react': 'React',
    'react-dom': 'ReactDOM',
    'styled-components': 'styled',
    'single-spa-react': 'singleSpaReact',
    'rxjs': 'rxjs',
    '@akashaproject/design-system': false
  }],
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 69000,
      minChunks: 2,
    }
  }
};
