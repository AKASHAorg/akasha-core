import { Grommet, GrommetProps } from 'grommet';
import * as React from 'react';
import { DefaultTheme } from '../interfaces';

export interface ITheme {
  name: string;
  theme: Promise<{ default: DefaultTheme }>;
}

export interface IThemeSelector extends GrommetProps {
  settings: { activeTheme: string };
  availableThemes: ITheme[];
  children: React.ReactNode;
  [key: string]: any;
}

/**
 * Default themes are: lightTheme and darkTheme
 * A world creator can add/install/create multiple themes
 * so he must pass those themes as props:
 *
 * import lightTheme from '@akashaproject/design-system'
 *
 * availableThemes={[
 *  lightTheme, // <- this is one of default themes so there is no need to import() it
 *  {
 *    name: 'myDarkGreenTheme',
 *    theme: import('./my-theme-dark-green')
 *  },
 *  {
 *    name: 'mySolarizedTheme',
 *    theme: import('./my-theme-solarized')
 *  }]}
 *
 */

// default to the first theme passed
const setFallbackTheme = (
  availableThemes: ITheme[],
  themeSetter: React.Dispatch<{ name: string; theme: DefaultTheme }>,
) => {
  availableThemes[0].theme.then(themeData =>
    themeSetter({ name: availableThemes[0].name, theme: themeData.default }),
  );
};

const setTheme = (
  theme: ITheme,
  themeSetter: React.Dispatch<{ name: string; theme: DefaultTheme }>,
) => {
  theme.theme.then(themeData => themeSetter({ name: theme.name, theme: themeData.default }));
};

const ThemeSelector = (props: IThemeSelector) => {
  const [loadedTheme, setLoadedTheme] = React.useState<{ name: string; theme: DefaultTheme }>();
  React.useEffect(() => {
    if (!loadedTheme) {
      const desiredTheme = props.availableThemes.find(
        theme => theme.name === props.settings.activeTheme,
      );
      if (!desiredTheme) {
        setFallbackTheme(props.availableThemes, setLoadedTheme);
      } else {
        setTheme(desiredTheme, setLoadedTheme);
      }
    } else {
      if (props.settings.activeTheme !== loadedTheme.name) {
        const desiredTheme = props.availableThemes.find(
          theme => theme.name === props.settings.activeTheme,
        );
        if (!desiredTheme) {
          setFallbackTheme(props.availableThemes, setLoadedTheme);
        } else {
          setTheme(desiredTheme, setLoadedTheme);
        }
      }
    }
  }, [props.settings.activeTheme]);
  if (loadedTheme && props.themeReadyEvent) {
    props.themeReadyEvent();
  }
  return (
    <>
      {loadedTheme && (
        <Grommet theme={loadedTheme.theme} {...props}>
          {props.children}
        </Grommet>
      )}
    </>
  );
};
export { ThemeSelector };
