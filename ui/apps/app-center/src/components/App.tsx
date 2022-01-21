import * as React from 'react';
import DS from '@akashaproject/design-system';
import { I18nextProvider } from 'react-i18next';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import i18next from '../i18n';

const { Box, Helmet } = DS;

const App: React.FC<RootComponentProps> = props => {
  const install = (name: string) => {
    return () => {
      if (props.installIntegration) {
        props.installIntegration(name);
      }
    };
  };
  const uninstall = (name: string) => {
    return () => {
      if (props.uninstallIntegration) {
        props.uninstallIntegration(name);
      }
    };
  };
  return (
    <Box width="100vw">
      <I18nextProvider i18n={i18next}>
        <Helmet>
          <title>App Center</title>
        </Helmet>
        <h1>App Center Plugin</h1>
        <div>
          Bookmarks App
          <button onClick={install('@akashaproject/app-bookmarks')}>Install</button>
          <button onClick={uninstall('@akashaproject/app-bookmarks')}>Uninstall</button>
          <button onClick={() => props.navigateToModal({ name: 'signin' })}>Signin Modal</button>
        </div>
      </I18nextProvider>
    </Box>
  );
};

export default App;
