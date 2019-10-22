import { deepMerge } from 'grommet/utils';
import { DefaultTheme } from 'styled-components';
import createCustomRadiobuttonTheme from './components/radiobutton';

const createGrommetTheme = (styledComponentsTheme: DefaultTheme) => {
  return deepMerge(styledComponentsTheme, {
    global: {
      edgeSize: {
        xxsmall: `${styledComponentsTheme.spacing.baseSpacing}px`,
        xsmall: `${styledComponentsTheme.spacing.baseSpacing * 2}px`,
        small: `${styledComponentsTheme.spacing.baseSpacing * 3}px`,
        medium: `${styledComponentsTheme.spacing.baseSpacing * 4}px`,
        large: `${styledComponentsTheme.spacing.baseSpacing * 5}px`,
        xlarge: `${styledComponentsTheme.spacing.baseSpacing * 10}px`,
      },
      elevation: {
        light: {
          shadow: styledComponentsTheme.shapes.lightShadow,
        },
        dark: {
          shadow: styledComponentsTheme.shapes.darkShadow,
        },
      },
      drop: {
        shadowSize: 'shadow',
        extend: `
          // border-radius: ${styledComponentsTheme.shapes.borderRadius};
          // margin-top: 5px;
          border: solid 1px ${styledComponentsTheme.colors.border};
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
        primaryText: styledComponentsTheme.colors.primaryText,
        secondaryText: styledComponentsTheme.colors.secondaryText,
        accentText: styledComponentsTheme.colors.accent,
        border: {
          dark: styledComponentsTheme.colors.border,
          light: styledComponentsTheme.colors.border,
        },
        text: {
          light: styledComponentsTheme.colors.primaryText,
          dark: styledComponentsTheme.colors.primaryText,
        },
      },
      focus: {
        border: {
          color: 'transparent',
        },
      },
    },
    text: {
      small: {
        size: '11px',
        height: '15px',
      },
      medium: {
        size: '13px',
        height: '18px',
      },
      large: {
        size: '15px',
        height: '20px',
      },
      xlarge: {
        size: '17px',
        height: '24px',
      },
    },
    ...createCustomRadiobuttonTheme(styledComponentsTheme),
  });
};

export default createGrommetTheme;
