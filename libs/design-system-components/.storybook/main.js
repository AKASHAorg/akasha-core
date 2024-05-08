module.exports = {
  framework: '@storybook/react-webpack5',
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-links',
  ],
  docs: {
    autodocs: 'tag',
    defaultName: 'Documentation',
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
  staticDirs: ['../../design-system-core/src/static/img'],
  webpackFinal: async config => {
    config.module.rules.push({
      test: /\.ts(x)?$/,
      loader: 'ts-loader',
    });
    return config;
  },
};
