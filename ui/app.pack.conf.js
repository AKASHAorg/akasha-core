module.exports = {
  externals: [
    {
      react: 'React',
      'react-dom': 'ReactDOM',
      'styled-components': 'styled',
      'single-spa-react': 'singleSpaReact',
      rxjs: 'rxjs',
      'rxjs/operators': 'rxjs.operators',
      '@akashaproject/design-system': false,
    },
  ],
  optimization: {},
};
