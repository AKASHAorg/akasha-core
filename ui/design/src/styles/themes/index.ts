import { base } from 'grommet/themes';
import { deepMerge } from 'grommet/utils';
import { DefaultTheme } from 'styled-components';

const createGrommetTheme = (styledComponentsTheme: DefaultTheme) => {
  const customTheme = deepMerge(styledComponentsTheme, base);
  return deepMerge(customTheme, {
    global: {
      edgeSize: {
        xxsmall: `${styledComponentsTheme.shapes.baseSpacing / 16}em`,
        xsmall: `${(styledComponentsTheme.shapes.baseSpacing * 2) / 16}em`,
        small: `${(styledComponentsTheme.shapes.baseSpacing * 3) / 16}em`,
        medium: `${(styledComponentsTheme.shapes.baseSpacing * 4) / 16}em`,
        large: `${(styledComponentsTheme.shapes.baseSpacing * 5) / 16}em`,
        xlarge: `${(styledComponentsTheme.shapes.baseSpacing * 10) / 16}em`,
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
        background: styledComponentsTheme.colors.background,
      },
      focus: {
        border: {
          color: 'transparent',
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
