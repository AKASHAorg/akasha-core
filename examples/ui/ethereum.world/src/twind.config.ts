import { defineConfig } from '@twind/core';
import presetAutoprefix from '@twind/preset-autoprefix';
import presetTailwind from '@twind/preset-tailwind';
import presetContainerQueries from '@twind/preset-container-queries';
export default defineConfig({
  presets: [presetAutoprefix(), presetTailwind(), presetContainerQueries()],
  darkMode: 'class',
  theme: {
    colors: {
      background: {
        /* For rgb(255 115 179 / <alpha-value>) */
        /* For rgba(255, 115, 179, <alpha-value>) */
        /* For hsl(198deg 93% 60% / <alpha-value>) */
        DEFAULT: 'rgb(var(--color-background-default) / <alpha-value>)',
        dark: 'rgb(var(--color-background-dark) / <alpha-value>)',
        light: 'rgb(var(--color-background-light) / <alpha-value>)',
      },
    },
  },
});
