import * as React from 'react';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter as Router } from 'react-router-dom';
import { RootComponentProps } from '@akashaorg/ui-awf-typings';
import SidebarComponent from './sidebar-component';

const SidebarWidget: React.FC<RootComponentProps> = props => {
  return (
    <I18nextProvider i18n={props.plugins?.translation?.i18n}>
      <Router>
        <SidebarComponent {...props} />
      </Router>
    </I18nextProvider>
  );
};

export default SidebarWidget;
