import { DefaultTheme } from 'styled-components';
import { deepMerge } from 'grommet/utils';
import createCustomCheckBoxTheme from './components/checkbox';
import createCustomRadiobuttonTheme from './components/radiobutton';
import createCustomTextInputTheme from './components/text-input';
// import createCustomModalTheme from './components/modal';
import createCustomIconTheme from './components/icon';

const createGrommetTheme = (styledComponentsTheme: DefaultTheme) => {
  return deepMerge(styledComponentsTheme, {
    global: {
      input: {
        weight: 400,
      },
      font: {
        family: styledComponentsTheme.shapes.fontFamily,
        size: styledComponentsTheme.spacing.fontSize,
      },
      colors: {
        border: 'light-6',
        'light-1': styledComponentsTheme.colors.white,
        'light-2': styledComponentsTheme.colors.background,
        'light-6': styledComponentsTheme.colors.lightGrey,
        'dark-1': styledComponentsTheme.colors.dark,
        'dark-2': styledComponentsTheme.colors.darkGrey,
        'dark-3': styledComponentsTheme.colors.grey,
        'accent-2': styledComponentsTheme.colors.border,
        'neutral-1': styledComponentsTheme.colors.green,
        'neutral-3': styledComponentsTheme.colors.blue,
        control: {
          light: styledComponentsTheme.colors.border,
          dark: styledComponentsTheme.colors.border,
        },
        text: {
          light: styledComponentsTheme.colors.dark,
          dark: styledComponentsTheme.colors.dark,
        },
      },
      control: {
        border: {
          radius: styledComponentsTheme.shapes.borderRadius,
        },
      },
      focus: {
        border: {
          color: 'neutral-3',
        },
      },
    },
    text: {
      medium: {
        size: '13px',
        height: '26px',
      },
    },
    select: {
      control: {
        extend: 'padding: 3px 6px;',
      },
    },
    grommet: {
      extend: () => `
        color: ${styledComponentsTheme.colors.dark}
      `,
    },
    ...createCustomTextInputTheme(styledComponentsTheme),
    ...createCustomCheckBoxTheme(styledComponentsTheme),
    ...createCustomRadiobuttonTheme(styledComponentsTheme),
    ...createCustomIconTheme(styledComponentsTheme),
  });
};

export default createGrommetTheme;
