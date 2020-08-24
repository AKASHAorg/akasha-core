import * as React from 'react';
import { addDecorator } from '@storybook/react';
// add support for component theming (light and dark)
import { withThemesProvider } from 'storybook-addon-styled-component-theme';
// import prepared themes from theme-sync-addon
// themes already have name prop.
import DS from '@akashaproject/design-system';
import { ThemeSelector } from '@akashaproject/design-system/lib/styles/themes/utils/theme-selector';

const { lightTheme, darkTheme } = DS;
// add themes and Grommet as custom theme provider
addDecorator(
  withThemesProvider([lightTheme, darkTheme], props => {
    return React.createElement(
      ThemeSelector,
      {
        settings: { activeTheme: 'Light-Theme' },
        availableThemes: [lightTheme, darkTheme],
      },
      props.children,
    );
  }),
);

export const parameters = {
  a11y: {
    element: '#root',
    config: {},
    options: {},
    manual: true,
  },
};
