import * as React from 'react';
import DS from '@akashaproject/design-system';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { I18nextProvider } from 'react-i18next';
import AppRoutes from './app-routes';

const { Box } = DS;

const SocialApp = (props: RootComponentProps) => {
  return (
    <Box width="100vw">
      <I18nextProvider i18n={props.i18next}>
        <AppRoutes {...props} />
      </I18nextProvider>
    </Box>
  );
};

export default SocialApp;
