import { DefaultTheme } from 'styled-components';

interface IconProps {
  theme: object;
}

const createCustomIconTheme = (styledComponentsTheme: DefaultTheme) => ({
  icon: {
    extend: () => `
    & * {
        stroke: ${styledComponentsTheme.colors.background} !important;
      }
    `,
  },
});

export default createCustomIconTheme;
