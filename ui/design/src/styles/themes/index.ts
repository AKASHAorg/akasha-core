import { base } from 'grommet/themes';
import { deepMerge } from 'grommet/utils';
import { DefaultTheme } from 'styled-components';

const createGrommetTheme = (styledComponentsTheme: DefaultTheme) => {
  const customTheme = deepMerge(styledComponentsTheme, base);
  return deepMerge(customTheme, {
    global: {
      edgeSize: {
        xxsmall: `${styledComponentsTheme.shapes.baseSpacing}px`,
        xsmall: `${styledComponentsTheme.shapes.baseSpacing * 2}px`,
        small: `${styledComponentsTheme.shapes.baseSpacing * 3}px`,
        medium: `${styledComponentsTheme.shapes.baseSpacing * 4}px`,
        large: `${styledComponentsTheme.shapes.baseSpacing * 5}px`,
        xlarge: `${styledComponentsTheme.shapes.baseSpacing * 10}px`,
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
      },
      focus: {
        border: {
          color: 'transparent',
        },
      },
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
