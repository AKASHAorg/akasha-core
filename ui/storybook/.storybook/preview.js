import * as React from 'react';
import { addDecorator, addParameters } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
// add support for component theming (light and dark)
import { withThemesProvider } from 'storybook-addon-styled-component-theme';
// import prepared themes from theme-sync-addon
// themes already have name prop.
import DS from '@akashaproject/design-system';
import { ThemeSelector } from '@akashaproject/design-system/lib/styles/themes/utils/theme-selector';

const { lightTheme, darkTheme } = DS;
addDecorator(withInfo);
addDecorator(withA11y);
addDecorator(withKnobs);
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

addParameters({
  options: {
    showRoots: true,
  },
});
