import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { RootComponentProps } from '@akashaorg/typings/ui';
import AppRoutes from './routes';
import Helmet from '@akashaorg/design-system-core/lib/components/Helmet';

const App: React.FC<RootComponentProps> = props => {
  return (
    <I18nextProvider i18n={props.plugins['@akashaorg/app-translation']?.translation?.i18n}>
      <Helmet>
        <title>Search | AKASHA World</title>
      </Helmet>
      <AppRoutes {...props} />
    </I18nextProvider>
  );
};

export default App;
