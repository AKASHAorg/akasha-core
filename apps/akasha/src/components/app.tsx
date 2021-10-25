import * as React from 'react';
import DS from '@akashaproject/design-system';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { I18nextProvider } from 'react-i18next';
import AppRoutes from './app-routes';
import i18n from '../i18n';

const { Box } = DS;

const SocialApp = (props: RootComponentProps) => {
  return (
    <Box width="100vw">
      <I18nextProvider i18n={i18n}>
        <AppRoutes {...props} />
      </I18nextProvider>
    </Box>
  );
};

export default SocialApp;
