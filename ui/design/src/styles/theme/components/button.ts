import { DefaultTheme } from 'styled-components';

const createCustomButtonTheme = (styledComponentsTheme: DefaultTheme) => ({
  button: {
    border: {
      radius: '11px',
    },
  },
});

export default createCustomButtonTheme;
