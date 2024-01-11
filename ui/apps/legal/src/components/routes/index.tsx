import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import ErrorBoundary, {
  ErrorBoundaryProps,
} from '@akashaorg/design-system-core/lib/components/ErrorBoundary';
import TermsOfService from './terms-of-service';
import TermsOfUse from './terms-of-use';
import CodeOfConduct from './code-of-conduct';
import PrivacyPolicy from './privacy-policy';
import DeveloperGuidelines from './developer-guidelines';

import route, { TOS, TOU, PP, COC, DG } from '../../routes';

const AppRoutes: React.FC<unknown> = () => {
  const { baseRouteName, logger } = useRootComponentProps();
  const { t } = useTranslation('app-legal');

  const props: Pick<ErrorBoundaryProps, 'errorObj' | 'logger'> = {
    errorObj: {
      type: t('script-error'),
      title: t('Error in legal app'),
    },
    logger,
  };

  return (
    <Router basename={baseRouteName}>
      <Routes>
        <Route
          path={route[TOS]}
          element={
            <ErrorBoundary {...props}>
              <TermsOfService />
            </ErrorBoundary>
          }
        />
        <Route
          path={route[TOU]}
          element={
            <ErrorBoundary {...props}>
              <TermsOfUse />
            </ErrorBoundary>
          }
        />
        <Route
          path={route[PP]}
          element={
            <ErrorBoundary {...props}>
              <PrivacyPolicy />
            </ErrorBoundary>
          }
        />
        <Route
          path={route[COC]}
          element={
            <ErrorBoundary {...props}>
              <CodeOfConduct />
            </ErrorBoundary>
          }
        />
        <Route
          path={route[DG]}
          element={
            <ErrorBoundary {...props}>
              <DeveloperGuidelines />
            </ErrorBoundary>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
