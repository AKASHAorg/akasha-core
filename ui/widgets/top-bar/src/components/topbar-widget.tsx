import * as React from 'react';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter as Router } from 'react-router-dom';

import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';

import TopbarComponent from './topbar-component';

const TopbarWidget: React.FC<unknown> = () => {
  const { getTranslationPlugin } = useRootComponentProps();

  return (
    <I18nextProvider i18n={getTranslationPlugin().i18n}>
      <Router>
        <TopbarComponent />
      </Router>
    </I18nextProvider>
  );
};

export default TopbarWidget;
