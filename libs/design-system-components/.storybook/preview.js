import '@akashaorg/design-system-core/src/twind/main.css';
import '@akashaorg/design-system-core/src/twind/globals.css';
import { install } from '@twind/core';
import twindConfig from './twind.config.js';
import DocTemplate from './DocTemplate.mdx';

install(twindConfig);

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  docs: {
    page: DocTemplate,
  },
};
