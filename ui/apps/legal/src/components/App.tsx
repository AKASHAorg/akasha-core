import * as React from 'react';
import DS from '@akashaproject/design-system';
import { I18nextProvider } from 'react-i18next';
import Routes from './routes';
import { RootComponentProps } from '@akashaproject/ui-awf-typings/lib';

const { Box } = DS;

const App: React.FC<RootComponentProps> = props => {
  return (
    <Box width="100vw">
      <I18nextProvider i18n={props.plugins?.translation?.i18n}>
        <Routes {...props} />
      </I18nextProvider>
    </Box>
  );
};

export default App;
