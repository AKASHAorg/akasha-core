import * as React from 'react';
import { RootComponentProps } from '@akashaorg/typings/ui';
import { I18nextProvider } from 'react-i18next';
import AppRoutes from './app-routes';

const MessagingApp: React.FC<RootComponentProps> = props => {
  return (
    <I18nextProvider i18n={props.plugins['@akashaorg/app-translation']?.translation?.i18n}>
      <AppRoutes {...props} />
    </I18nextProvider>
  );
};

export default MessagingApp;
