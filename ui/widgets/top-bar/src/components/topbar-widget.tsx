import * as React from 'react';
import { I18nextProvider } from 'react-i18next';
import { RootComponentProps } from '@akashaorg/typings/ui';
import { BrowserRouter as Router } from 'react-router-dom';
import TopbarComponent from './topbar-component';

const TopbarWidget = (props: RootComponentProps) => {
  return (
    <I18nextProvider i18n={props.plugins?.translation?.i18n}>
      <Router>
        <TopbarComponent {...props} />
      </Router>
    </I18nextProvider>
  );
};

export default TopbarWidget;
