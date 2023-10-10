module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [],
  framework: '@storybook/react-webpack5',
  webpackFinal: async config => {
    config.module.rules.push({ test: /\.ts(x)?$/, use: 'ts-loader' });
    return config;
  },
};
