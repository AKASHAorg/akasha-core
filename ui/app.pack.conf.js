module.exports = {
  externals: [{
    'react': 'React',
    'react-dom': 'ReactDOM',
    'styled-components': 'styled',
    'single-spa-react': 'singleSpaReact',
    'rxjs': 'rxjs',
    '@akashaproject/design-system': 'akashaproject__design_system'
  }],
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 69000,
      minChunks: 2,
    }
  }
};
