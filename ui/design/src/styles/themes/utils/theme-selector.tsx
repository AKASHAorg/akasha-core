import { Grommet, GrommetProps } from 'grommet';
import * as React from 'react';
import { DefaultTheme } from '../interfaces';

export interface ITheme {
  name: string;
  theme: Promise<{ default: DefaultTheme }> | DefaultTheme;
}

export interface IThemeSelector {
  settings: { activeTheme: string };
  availableThemes: ITheme[];
  children: React.ReactNode;
  themeReadyEvent?: () => void;
}

/**
 * Default themes are: lightTheme and darkTheme
 * A world creator can add/install/create multiple themes.
 * Themes must be passed as props:
 *
 *```ts
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
 *```
 */

// default to the first theme passed
const setFallbackTheme = (
  availableThemes: ITheme[],
  themeSetter: React.Dispatch<{ name: string; theme: DefaultTheme }>,
) => {
  if (availableThemes[0].theme instanceof Promise) {
    availableThemes[0].theme.then(themeData =>
      themeSetter({ name: availableThemes[0].name, theme: themeData.default }),
    );
  } else {
    themeSetter({ name: availableThemes[0].name, theme: availableThemes[0].theme });
  }
};

const setTheme = (
  theme: ITheme,
  themeSetter: React.Dispatch<{ name: string; theme: DefaultTheme }>,
) => {
  if (theme.theme instanceof Promise) {
    theme.theme.then(themeData => themeSetter({ name: theme.name, theme: themeData.default }));
  } else {
    themeSetter({ name: theme.name, theme: theme.theme });
  }
};

const ThemeSelector = (props: IThemeSelector & GrommetProps) => {
  const [loadedTheme, setLoadedTheme] = React.useState<{ name: string; theme: DefaultTheme }>();
  const componentIsUnmounted = React.useRef(false);

  React.useEffect(() => {
    if (!loadedTheme) {
      const desiredTheme = props.availableThemes.find(
        theme => theme.name === props.settings.activeTheme,
      );
      if (!desiredTheme) {
        setFallbackTheme(props.availableThemes, themeData => {
          if (!componentIsUnmounted.current) {
            setLoadedTheme(themeData);
          }
        });
      } else {
        setTheme(desiredTheme, themeData => {
          if (!componentIsUnmounted.current) {
            setLoadedTheme(themeData);
          }
        });
      }
    } else {
      if (props.settings.activeTheme !== loadedTheme.name) {
        const desiredTheme = props.availableThemes.find(
          theme => theme.name === props.settings.activeTheme,
        );
        if (!desiredTheme) {
          setFallbackTheme(props.availableThemes, themeData => {
            if (!componentIsUnmounted.current) {
              setLoadedTheme(themeData);
            }
          });
        } else {
          setTheme(desiredTheme, themeData => {
            if (!componentIsUnmounted.current) {
              setLoadedTheme(themeData);
            }
          });
        }
      }
    }
    () => {
      componentIsUnmounted.current = true;
    };
  }, [loadedTheme, props.availableThemes, props.settings.activeTheme]);

  React.useEffect(() => {
    if (props.themeReadyEvent) {
      props.themeReadyEvent();
    }
  }, [loadedTheme, props]);

  return (
    <>
      {loadedTheme && (
        <Grommet
          style={{ width: '100%' }}
          theme={loadedTheme.theme}
          {...props}
          background={'transparent'}
        >
          {props.children}
        </Grommet>
      )}
    </>
  );
};
export { ThemeSelector };
