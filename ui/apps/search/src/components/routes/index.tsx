import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { useRootComponentProps, useGetLogin } from '@akashaorg/ui-awf-hooks';
import ErrorBoundary, {
  ErrorBoundaryProps,
} from '@akashaorg/design-system-core/lib/components/ErrorBoundary';
import SearchPage from './search-page';
import OnboardingPage from './onboarding-page';
import SettingsPage from './search-settings-page';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

import routes, { ONBOARDING, RESULTS, SETTINGS } from '../../routes';

const AppRoutes: React.FC<unknown> = () => {
  const { baseRouteName, logger, navigateToModal } = useRootComponentProps();
  const { t } = useTranslation('app-search');

  const { data } = useGetLogin();
  const isLoggedIn = !!data?.id;

  const showLoginModal = () => {
    navigateToModal({ name: 'login' });
  };

  const errorBoundaryProps: Pick<ErrorBoundaryProps, 'errorObj' | 'logger'> = {
    errorObj: {
      type: 'script-error',
      title: t('Error in search app'),
    },
    logger,
  };

  return (
    <React.StrictMode>
      <Router basename={baseRouteName}>
        <Stack testId="search-box">
          <Routes>
            <Route
              path="/"
              element={
                <ErrorBoundary {...errorBoundaryProps}>
                  <Navigate to={routes[RESULTS]} replace />
                </ErrorBoundary>
              }
            />
            <Route path={routes[RESULTS]}>
              <Route
                path=":searchKeyword"
                element={
                  <ErrorBoundary {...errorBoundaryProps}>
                    <SearchPage showLoginModal={showLoginModal} isLoggedIn={isLoggedIn} />
                  </ErrorBoundary>
                }
              />
              <Route
                path=""
                element={
                  <ErrorBoundary {...errorBoundaryProps}>
                    <SearchPage showLoginModal={showLoginModal} isLoggedIn={isLoggedIn} />
                  </ErrorBoundary>
                }
              />
            </Route>
            <Route
              path={routes[SETTINGS]}
              element={
                <ErrorBoundary {...errorBoundaryProps}>
                  <SettingsPage showLoginModal={showLoginModal} isLoggedIn={isLoggedIn} />
                </ErrorBoundary>
              }
            />
            <Route
              path={routes[ONBOARDING]}
              element={
                <ErrorBoundary {...errorBoundaryProps}>
                  <OnboardingPage showLoginModal={showLoginModal} isLoggedIn={isLoggedIn} />
                </ErrorBoundary>
              }
            />
          </Routes>
        </Stack>
      </Router>
    </React.StrictMode>
  );
};

export default AppRoutes;
