module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  staticDirs: ['../../build/images'],
  addons: [],
  framework: '@storybook/react-webpack5',
  webpackFinal: async config => {
    config.module.rules.push({
      test: /\.ts(x)?$/,
      loader: 'ts-loader',
    });
    return config;
  },
};
