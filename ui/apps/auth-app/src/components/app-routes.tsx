import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import ErrorBoundary from '@akashaorg/design-system-core/lib/components/ErrorBoundary';
import Connect from './connect';
import routes, { CONNECT } from '../routes';

const AppRoutes: React.FC<unknown> = () => {
  const { baseRouteName, logger } = useRootComponentProps();
  const { t } = useTranslation('app-auth-ewa');

  return (
    <ErrorBoundary
      errorObj={{
        type: t('script-error'),
        title: t('Error in auth app'),
      }}
      logger={logger}
    >
      <Router basename={baseRouteName}>
        <Routes>
          <Route path={`${routes[CONNECT]}/*`} element={<Connect />} />
          <Route path="/" element={<Navigate to={routes.Connect} replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default AppRoutes;
