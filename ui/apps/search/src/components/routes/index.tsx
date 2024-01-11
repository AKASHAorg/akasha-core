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

  const props: Pick<ErrorBoundaryProps, 'errorObj' | 'logger'> = {
    errorObj: {
      type: t('script-error'),
      title: t('Error in search app'),
    },
    logger,
  };

  return (
    <Router basename={baseRouteName}>
      <Stack testId="search-box">
        <Routes>
          <Route
            path="/"
            element={
              <ErrorBoundary {...props}>
                <Navigate to={routes[RESULTS]} replace />
              </ErrorBoundary>
            }
          />
          <Route path={routes[RESULTS]}>
            <Route
              path=":searchKeyword"
              element={
                <ErrorBoundary {...props}>
                  <SearchPage showLoginModal={showLoginModal} isLoggedIn={isLoggedIn} />
                </ErrorBoundary>
              }
            />
            <Route
              path=""
              element={
                <ErrorBoundary {...props}>
                  <SearchPage showLoginModal={showLoginModal} isLoggedIn={isLoggedIn} />
                </ErrorBoundary>
              }
            />
          </Route>
          <Route
            path={routes[SETTINGS]}
            element={
              <ErrorBoundary {...props}>
                <SettingsPage showLoginModal={showLoginModal} isLoggedIn={isLoggedIn} />
              </ErrorBoundary>
            }
          />
          <Route
            path={routes[ONBOARDING]}
            element={
              <ErrorBoundary {...props}>
                <OnboardingPage showLoginModal={showLoginModal} isLoggedIn={isLoggedIn} />
              </ErrorBoundary>
            }
          />
        </Routes>
      </Stack>
    </Router>
  );
};

export default AppRoutes;
