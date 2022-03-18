// Note! Jest 24 + TypeScript
// only works when babel.config.js is present
// and not .babelrc or .babrlrc.js

module.exports = {
  env: {
    test: {
      presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
      plugins: ['@babel/plugin-transform-runtime'],
    },
  },
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    // {
    //   runtime: 'automatic',
    //   development: process.env.NODE_ENV !== 'production',
    //   importSource: '@welldone-software/why-did-you-render',
    // },
    '@babel/preset-typescript',
  ],
  plugins: [],
};
