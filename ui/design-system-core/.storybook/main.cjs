// const path = require('path');
// const tailwindConfig = path.join(__dirname, '../src/tailwind/tailwind.config.cjs');
// const foundationInit = require('storybook-tailwind-foundations/initialize.js');

// foundationInit.default(tailwindConfig);

module.exports = {
  stories: [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
    // '../node_modules/storybook-tailwind-foundations/**/*.stories.js',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    'storybook-addon-designs',
    'storybook-tailwind-dark-mode',
  ],
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      compilerOptions: {
        module: 'es2020',
        target: 'es2020',
        lib: ['dom', 'es2020'],
      },
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: prop => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
};
