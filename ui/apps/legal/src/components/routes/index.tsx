import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import ErrorBoundary from '@akashaorg/design-system-core/lib/components/ErrorBoundary';
import TermsOfService from './terms-of-service';
import TermsOfUse from './terms-of-use';
import CodeOfConduct from './code-of-conduct';
import PrivacyPolicy from './privacy-policy';
import DeveloperGuidelines from './developer-guidelines';

import route, { TOS, TOU, PP, COC, DG } from '../../routes';

const AppRoutes: React.FC<unknown> = () => {
  const { baseRouteName, logger } = useRootComponentProps();
  const { t } = useTranslation('app-legal');

  return (
    <ErrorBoundary
      errorObj={{
        type: t('script-error'),
        title: t('Error in legal app'),
      }}
      logger={logger}
    >
      <Router basename={baseRouteName}>
        <Routes>
          <Route path={route[TOS]} element={<TermsOfService />} />
          <Route path={route[TOU]} element={<TermsOfUse />} />
          <Route path={route[PP]} element={<PrivacyPolicy />} />
          <Route path={route[COC]} element={<CodeOfConduct />} />
          <Route path={route[DG]} element={<DeveloperGuidelines />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default AppRoutes;
