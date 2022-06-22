import * as React from 'react';
import { RootComponentProps } from '@akashaorg/ui-awf-typings';
import DS from '@akashaorg/design-system';
import { I18nextProvider } from 'react-i18next';
import AppRoutes from './app-routes';

const { Box } = DS;

const MessagingApp: React.FC<RootComponentProps> = props => {
  return (
    <Box width="100vw">
      <I18nextProvider i18n={props.plugins?.translation?.i18n}>
        <AppRoutes {...props} />
      </I18nextProvider>
    </Box>
  );
};

export default MessagingApp;
