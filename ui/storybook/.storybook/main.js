module.exports = {
  stories: ['../src/components/*.stories.tsx'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-knobs',
    '@storybook/addon-storysource',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-a11y',
    // styled components themes support
    'storybook-addon-styled-component-theme/dist/register',
    // add theme sync between component's theme and storybook theme
    // './theme-sync-addon',
  ],
};
