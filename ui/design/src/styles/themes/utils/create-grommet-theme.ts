import { base } from 'grommet/themes';
import { deepMerge } from 'grommet/utils';
import { DefaultTheme } from '../interfaces';
import { FormCheckmark } from 'grommet-icons';

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
        background: styledComponentsTheme.colors.cardBackground,
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
        darkText: styledComponentsTheme.colors.darkText,
        border: {
          dark: styledComponentsTheme.colors.border,
          light: styledComponentsTheme.colors.border,
        },
        lightBorder: styledComponentsTheme.colors.lightBorder,
        text: {
          light: styledComponentsTheme.colors.primaryText,
          dark: styledComponentsTheme.colors.primaryText,
        },
        accent: styledComponentsTheme.colors.accent,
        brand: styledComponentsTheme.colors.accent,
        darkBorder: styledComponentsTheme.colors.darkBorder,
        background: styledComponentsTheme.colors.background,
        darkBackground: styledComponentsTheme.colors.darkBackground,
        modalBackground: styledComponentsTheme.colors.modalBackground,
        modalBackgroundAlt: styledComponentsTheme.colors.modalBackgroundAlt,
        modalBackgroundTransparent: styledComponentsTheme.colors.modalBackgroundTransparent,
        cardBackground: styledComponentsTheme.colors.cardBackground,
        hoverBackground: styledComponentsTheme.colors.hoverBackground,
        inputBackground: styledComponentsTheme.colors.inputBackground,
        activeCardBackground: styledComponentsTheme.colors.activeCardBackground,
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
      size: '18px',
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
    checkBox: {
      size: '20px',
      toggle: {
        size: '42px',
        radius: '50px',
        background: styledComponentsTheme.colors.secondaryText,
        color: styledComponentsTheme.colors.white,
        extend: ({ checked }) =>
          `border-color: ${styledComponentsTheme.colors.darkBorder};
          ${
            checked &&
            `background-color: ${styledComponentsTheme.colors.accent};
             `
          }
          `,
        knob: {
          extend: ({ checked }) =>
            `border-color: ${styledComponentsTheme.colors.border};
            display: inline-flex;
            width: 1rem;
            height: 1rem;
            ${checked && `background-color: ${styledComponentsTheme.colors.white} !important;`}`,
        },
      },
      border: {
        color: styledComponentsTheme.colors.accent,
        width: styledComponentsTheme.shapes.thickness.small,
      },
      check: {
        extend: ({ checked }) =>
          `${checked && `background-color: ${styledComponentsTheme.colors.accent};`}`,
      },
      radius: styledComponentsTheme.shapes.smallBorderRadius,
      hover: {
        border: {
          color: styledComponentsTheme.colors.accent,
        },
      },
      icon: {
        extend: `stroke: ${styledComponentsTheme.colors.white};`,
      },
      icons: {
        checked: FormCheckmark,
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
