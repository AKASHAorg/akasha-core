import React from 'react';
import DS from '@akashaorg/design-system';
import { I18nextProvider } from 'react-i18next';
import Routes from './routes';
import { RootComponentProps } from '@akashaorg/ui-awf-typings';

const { Box } = DS;

const App = (props: RootComponentProps) => {
  return (
    <Box width="100vw">
      <I18nextProvider i18n={props.plugins?.translation?.i18n}>
        <Routes {...props} />
      </I18nextProvider>
    </Box>
  );
};

export default App;
