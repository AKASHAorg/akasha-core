import { Grommet, GrommetProps } from 'grommet';
import * as React from 'react';
import darkTheme from './dark-theme';
import lightTheme from './light-theme';

export interface IThemeSelector extends GrommetProps {
  settings: { activeTheme: string };
  availableThemes: string[];
  children: React.ReactNode;
}

const ThemeSelector = (props: IThemeSelector) => {
  const { settings } = props;
  props.availableThemes = ['lightTheme', 'darktheme'];
  let currentTheme = lightTheme;
  if (settings.activeTheme && settings.activeTheme.includes('dark')) {
    currentTheme = darkTheme;
  }
  return (
    <Grommet theme={currentTheme} {...props}>
      {props.children}
    </Grommet>
  );
};

export { ThemeSelector };
