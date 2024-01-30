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

  const errorBoundaryProps: Pick<ErrorBoundaryProps, 'errorObj' | 'logger'> = {
    errorObj: {
      type: 'script-error',
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
            <ErrorBoundary {...errorBoundaryProps}>
              <TermsOfService />
            </ErrorBoundary>
          }
        />
        <Route
          path={route[TOU]}
          element={
            <ErrorBoundary {...errorBoundaryProps}>
              <TermsOfUse />
            </ErrorBoundary>
          }
        />
        <Route
          path={route[PP]}
          element={
            <ErrorBoundary {...errorBoundaryProps}>
              <PrivacyPolicy />
            </ErrorBoundary>
          }
        />
        <Route
          path={route[COC]}
          element={
            <ErrorBoundary {...errorBoundaryProps}>
              <CodeOfConduct />
            </ErrorBoundary>
          }
        />
        <Route
          path={route[DG]}
          element={
            <ErrorBoundary {...errorBoundaryProps}>
              <DeveloperGuidelines />
            </ErrorBoundary>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
