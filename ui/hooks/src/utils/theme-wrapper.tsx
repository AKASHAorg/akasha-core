import * as React from 'react';
import DS from '@akashaproject/design-system';
import { EventTypes, UIEventData } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
const { ThemeSelector, lightTheme, darkTheme } = DS;

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
