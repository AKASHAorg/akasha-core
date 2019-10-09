import { deepMerge } from 'grommet/utils';
import { DefaultTheme } from 'styled-components';
import createCustomRadiobuttonTheme from './components/radiobutton';
import createCustomTextInputTheme from './components/text-input';
import createCustomButtonTheme from './components/button';

const createGrommetTheme = (styledComponentsTheme: DefaultTheme) => {
  return deepMerge(styledComponentsTheme, {
    global: {
      elevation: {
        light: {
          styleGuideShadow: styledComponentsTheme.shapes.shadow,
        },
      },
      drop: {
        shadowSize: 'styleGuideShadow',
        border: {
          radius: '11px',
        },
        extend: `
          margin-top: 5px;
          overflow: hidden;
          border: solid 1px ${styledComponentsTheme.colors.background};
        `,
      },
      input: {
        weight: styledComponentsTheme.shapes.fontWeight.regular,
      },
      font: {
        family: styledComponentsTheme.shapes.fontFamily,
        size: styledComponentsTheme.spacing.fontSize,
      },
      colors: {
        border: {
          dark: styledComponentsTheme.colors.background,
          light: styledComponentsTheme.colors.background,
        },
        text: {
          light: styledComponentsTheme.colors.darkBlue,
          dark: styledComponentsTheme.colors.background,
        },
      },
      focus: {
        border: {
          color: 'transparent',
        },
      },
    },
    text: {
      medium: {
        size: '13px',
        height: '18px',
      },
    },
    ...createCustomButtonTheme(styledComponentsTheme),
    // ...createCustomTextInputTheme(styledComponentsTheme),
    ...createCustomRadiobuttonTheme(styledComponentsTheme),
  });
};

export default createGrommetTheme;
