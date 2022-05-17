import * as React from 'react';
import DS from '@akashaorg/design-system';
import { EventTypes, UIEventData } from '@akashaorg/ui-awf-typings/lib/app-loader';
import { RootComponentProps } from '@akashaorg/ui-awf-typings';
const { ThemeSelector, lightTheme, darkTheme } = DS;

/**
 * React component that fetches the user selected theme name from the localstorage
 * and passes it to the ThemeSelector component along with all available themes.
 */
const ThemeWrapper: React.FC<RootComponentProps> = ({ children, ...props }) => {
  const [currentTheme, setCurrentTheme] = React.useState(window.localStorage.getItem('Theme'));

  React.useEffect(() => {
    const sub = props.uiEvents.subscribe({
      next: (eventData: UIEventData) => {
        if (eventData.event === EventTypes.ThemeChange) {
          setCurrentTheme(eventData.data.name);
        }
      },
    });
    return () => sub.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <ThemeSelector
      settings={{ activeTheme: currentTheme || 'Light-Theme' }}
      availableThemes={[lightTheme, darkTheme]}
    >
      {children}
    </ThemeSelector>
  );
};

export default ThemeWrapper;
