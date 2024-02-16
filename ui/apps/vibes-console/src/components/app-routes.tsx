import React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import ErrorBoundary, {
  ErrorBoundaryProps,
} from '@akashaorg/design-system-core/lib/components/ErrorBoundary';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

import { Applications, Dashboard, Settings } from '../pages';
import routes, { HOME, REVIEW_HUB, SETTINGS } from '../routes';

const AppRoutes: React.FC<unknown> = () => {
  const { baseRouteName, logger } = useRootComponentProps();
  const { t } = useTranslation('app-vibes-console');

  const errorBoundaryProps: Pick<ErrorBoundaryProps, 'errorObj' | 'logger'> = {
    errorObj: {
      type: 'script-error',
      title: t('Error in Vibes Console app'),
    },
    logger,
  };

  return (
    <Stack customStyle="mb-4">
      <Router basename={baseRouteName}>
        <Routes>
          <Route
            path={routes[HOME]}
            element={
              <ErrorBoundary {...errorBoundaryProps}>
                <Applications />
              </ErrorBoundary>
            }
          />
          <Route
            path={routes[REVIEW_HUB]}
            element={
              <ErrorBoundary {...errorBoundaryProps}>
                <Dashboard />
              </ErrorBoundary>
            }
          />
          <Route
            path={routes[SETTINGS]}
            element={
              <ErrorBoundary {...errorBoundaryProps}>
                <Settings />
              </ErrorBoundary>
            }
          />
          <Route path="/" element={<Navigate to={routes[HOME]} replace />} />
        </Routes>
      </Router>
    </Stack>
  );
};

export default AppRoutes;
