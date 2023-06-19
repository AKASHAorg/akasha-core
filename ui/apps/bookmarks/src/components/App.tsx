import * as React from 'react';
import { I18nextProvider } from 'react-i18next';
import AppRoutes from './app-routes';
import { RootComponentProps } from '@akashaorg/typings/ui';
import Box from '@akashaorg/design-system-core/lib/components/Box';

const App: React.FC<RootComponentProps> = props => {
  return (
    <Box>
      <I18nextProvider i18n={props.plugins['@akashaorg/app-translation']?.translation?.i18n}>
        <AppRoutes {...props} />
      </I18nextProvider>
    </Box>
  );
};

export default App;
