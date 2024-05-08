import { useCallback, useEffect, useState } from 'react';
import { ThemingEvents } from '@akashaorg/typings/lib/ui';
import { useRootComponentProps } from './use-root-props';

export type theme = 'Light-Theme' | 'Dark-Theme';

export const useTheme = () => {
  const { uiEvents } = useRootComponentProps();

  // get the current theme from local storage
  const currentTheme = window.localStorage.getItem('Theme') as theme;

  const [theme, setTheme] = useState<theme>(currentTheme);

  const propagateTheme = useCallback(
    (_theme: theme, setToLocal?: boolean) => {
      setTheme(_theme);
      if (setToLocal) {
        window.localStorage.setItem('Theme', _theme);
      }
      /*
       * Custom event used in main html file to update the theme in the <body> tag
       */
      const ev = new CustomEvent(ThemingEvents.ThemeChange, {
        detail: {
          theme: _theme,
        },
      });
      window.dispatchEvent(ev);
      /*
       * Propagate the change to all apps and widgets
       */
      uiEvents.next({
        event: ThemingEvents.ThemeChange,
        data: {
          name: _theme,
        },
      });
    },
    [uiEvents],
  );

  useEffect(() => {
    /**
     * if no theme is set on local storage, default to user's preference (auto)
     */
    const userPrefTheme = window.matchMedia('(prefers-color-scheme: dark)');
    if (!currentTheme) {
      propagateTheme(userPrefTheme.matches ? 'Dark-Theme' : 'Light-Theme');
    }
    const setThemeFromUserPref = ({ matches }) => {
      if (!currentTheme) {
        propagateTheme(matches ? 'Dark-Theme' : 'Light-Theme');
      }
    };
    userPrefTheme.addEventListener('change', setThemeFromUserPref);

    return () => userPrefTheme.removeEventListener('change', () => ({}));
  }, [currentTheme, theme, propagateTheme]);

  return { theme, propagateTheme };
};
