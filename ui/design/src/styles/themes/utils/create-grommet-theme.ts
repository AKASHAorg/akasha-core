import { base } from 'grommet/themes';
import { deepMerge } from 'grommet/utils';
import { DefaultTheme } from 'styled-components';

const createGrommetTheme = (styledComponentsTheme: DefaultTheme) => {
  const customTheme = deepMerge(styledComponentsTheme, base);
  return deepMerge(customTheme, {
    global: {
      edgeSize: {
        xxsmall: `${styledComponentsTheme.shapes.baseSpacing / 16}rem`,
        xsmall: `${(styledComponentsTheme.shapes.baseSpacing * 2) / 16}rem`,
        small: `${(styledComponentsTheme.shapes.baseSpacing * 3) / 16}rem`,
        medium: `${(styledComponentsTheme.shapes.baseSpacing * 4) / 16}rem`,
        large: `${(styledComponentsTheme.shapes.baseSpacing * 5) / 16}rem`,
        xlarge: `${(styledComponentsTheme.shapes.baseSpacing * 10) / 16}rem`,
      },
      elevation: {
        light: {
          shadow: styledComponentsTheme.colors.shadow,
        },
        dark: {
          shadow: styledComponentsTheme.colors.shadow,
        },
      },
      drop: {
        shadowSize: 'shadow',
      },

      input: {
        weight: styledComponentsTheme.shapes.fontWeight.regular,
      },
      font: {
        family: styledComponentsTheme.shapes.fontFamily,
        size: styledComponentsTheme.shapes.defaultFontSize,
      },
      colors: {
        primaryText: styledComponentsTheme.colors.primaryText,
        secondaryText: styledComponentsTheme.colors.secondaryText,
        errorText: styledComponentsTheme.colors.errorText,
        accentText: styledComponentsTheme.colors.accent,
        border: {
          dark: styledComponentsTheme.colors.border,
          light: styledComponentsTheme.colors.border,
        },
        text: {
          light: styledComponentsTheme.colors.primaryText,
          dark: styledComponentsTheme.colors.primaryText,
        },
        accent: styledComponentsTheme.colors.accent,
        brand: styledComponentsTheme.colors.accent,
        darkBorder: styledComponentsTheme.colors.darkBorder,
        background: styledComponentsTheme.colors.background,
        modalBackground: styledComponentsTheme.colors.modalBackground,
        modalBackgroundAlt: styledComponentsTheme.colors.modalBackgroundAlt,
        modalBackgroundTransparent: styledComponentsTheme.colors.modalBackgroundTransparent,
        lightBackground: styledComponentsTheme.colors.lightBackground,
        ultraLightBackground: styledComponentsTheme.colors.ultraLightBackground,
        focus: styledComponentsTheme.colors.accent,
      },
      focus: {
        border: {
          color: 'transparent',
        },
      },
    },
    radioButton: {
      size: '16px',
      border: {
        width: '1px',
        color: styledComponentsTheme.colors.accent,
      },
      check: {
        color: styledComponentsTheme.colors.accent,
        background: {
          color: styledComponentsTheme.colors.white,
        },
      },
      hover: {
        border: {
          color: styledComponentsTheme.colors.accent,
        },
        background: {
          // color: styledComponentsTheme.colors.accent,
        },
      },
    },
    accordion: {
      icons: {
        color: `${styledComponentsTheme.colors.border}`,
      },
      border: undefined,
    },
    text: {
      small: {
        size: styledComponentsTheme.shapes.fontSizes.small.size,
        height: styledComponentsTheme.shapes.fontSizes.small.height,
      },
      medium: {
        size: styledComponentsTheme.shapes.fontSizes.medium.size,
        height: styledComponentsTheme.shapes.fontSizes.medium.height,
      },
      large: {
        size: styledComponentsTheme.shapes.fontSizes.large.size,
        height: styledComponentsTheme.shapes.fontSizes.large.height,
      },
      xlarge: {
        size: styledComponentsTheme.shapes.fontSizes.xlarge.size,
        height: styledComponentsTheme.shapes.fontSizes.xlarge.height,
      },
    },
  });
};

export default createGrommetTheme;
