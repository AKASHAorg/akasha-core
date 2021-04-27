import * as React from 'react';
import { DefaultTheme } from '../styles/themes/interfaces';
import { ThemeSelector } from '../styles/themes/utils/theme-selector';
import { createTheme } from '../styles/themes/utils/create-theme';
// const { ThemeSelector, createTheme } = DS;

const TestThemeProvider: React.FC = ({ children }) => {
  const themeData = createTheme();
  return (
    <React.Suspense fallback="loading">
      <div id="test-theme-selector">
        <ThemeSelector
          availableThemes={[{ name: 'test-light-theme', theme: themeData as DefaultTheme }]}
          settings={{ activeTheme: 'lightTheme' }}
        >
          {children}
        </ThemeSelector>
      </div>
    </React.Suspense>
  );
};

export { TestThemeProvider };
