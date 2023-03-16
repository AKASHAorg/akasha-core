import '../src/twind/main.css';
import { install } from '@twind/core';
import twindConfig from '../src/twind/twind.config.js';

install(twindConfig);

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
