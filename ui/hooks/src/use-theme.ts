/* eslint-disable tsdoc/syntax */
import { useEffect, useState } from 'react';
import { EventTypes } from '@akashaorg/typings/ui';
import { useRootComponentProps } from './use-root-props';

export type theme = 'Light-Theme' | 'Dark-Theme';

export const useTheme = () => {
  const { uiEvents } = useRootComponentProps();

  // get the current theme from local storage
  const currentTheme = window.localStorage.getItem('Theme') as theme;

  const [theme, setTheme] = useState<theme>(currentTheme);

  const propagateTheme = (_theme: theme) => {
    setTheme(_theme);

    window.localStorage.setItem('Theme', _theme);
    /*
     * Custom event used in main html file
     * to update the theme in the <body> tag
     */
    const ev = new CustomEvent(EventTypes.ThemeChange, {
      detail: {
        theme: _theme,
      },
    });

    window.dispatchEvent(ev);

    /*
     * Propagate the change to all apps and widgets
     */
    uiEvents.next({
      event: EventTypes.ThemeChange,
      data: {
        name: _theme,
      },
    });
  };

  useEffect(() => {
    /**
     * if no theme is set on local storage,
     * default to user's preference
     */
    if (!currentTheme) {
      /**
       * check user's preference.
       * To automatically switch theme when user's preference changes,
       * simply add an event listener like so:
       *
       * colorScheme.addEventListener('change', ({ matches }) => {
            if (matches) {
              // do something
            } else {
              //do something else
            }
          });
       */
      const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');

      propagateTheme(colorScheme?.matches ? 'Dark-Theme' : 'Light-Theme');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { theme, propagateTheme };
};
