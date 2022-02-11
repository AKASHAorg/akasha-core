import * as React from 'react';
import { I18nextProvider } from 'react-i18next';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import TopbarComponent from './topbar-component';
import { BrowserRouter as Router } from 'react-router-dom';

const TopbarWidget = (props: RootComponentProps) => {
  return (
    <I18nextProvider i18n={props.i18next}>
      <Router>
        <TopbarComponent {...props} />
      </Router>
    </I18nextProvider>
  );
};

export default TopbarWidget;
