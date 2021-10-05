import React from 'react';
import DS from '@akashaproject/design-system';
import { I18nextProvider } from 'react-i18next';
import LoginWidget from './login-cta-widget';
import i18next from '../i18n';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';

const { ThemeSelector, lightTheme, darkTheme } = DS;

const LoginCTAWidgetRoot: React.FC<RootComponentProps> = () => {
  return (
    <I18nextProvider i18n={i18next}>
      <ThemeSelector
        settings={{ activeTheme: 'Light-Theme' }}
        availableThemes={[lightTheme, darkTheme]}
        plain={true}
      >
        <LoginWidget />
      </ThemeSelector>
    </I18nextProvider>
  );
};

export default LoginCTAWidgetRoot;
