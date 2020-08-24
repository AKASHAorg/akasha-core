module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve('awesome-typescript-loader'),
      },
      // Optional
      {
        loader: require.resolve('react-docgen-typescript-loader'),
      },
    ],
    exclude: {
      test: [/\*d.ts(x?)$/, /\.map$/],
    },
  });
  config.module.rules.push({
    test: /\.stories\.tsx?$/,
    use: [
      {
        loader: require.resolve('@storybook/source-loader'),
        options: { parser: 'typescript' },
      },
    ],
    enforce: 'pre',
  });
  config.resolve.extensions.push('.ts', '.tsx', '.js');
  return config;
};
