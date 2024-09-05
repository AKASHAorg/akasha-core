import '@akashaorg/design-system-core/src/twind/main.css';
import '@akashaorg/design-system-core/src/twind/globals.css';
import { install } from '@twind/core';
import twindConfig from './twind.config.js';

install(twindConfig);

export const preview = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  tags: ['autodocs'],
};

export default preview;
