import '@akashaorg/ui/main.css';
import '@akashaorg/ui/globals.css';

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
