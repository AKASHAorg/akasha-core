import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { useRootComponentProps, useGetLogin } from '@akashaorg/ui-awf-hooks';
import ErrorBoundary from '@akashaorg/design-system-core/lib/components/ErrorBoundary';
import SearchPage from './search-page';
import OnboardingPage from './onboarding-page';
import SettingsPage from './settings-page';
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

  return (
    <ErrorBoundary
      errorObj={{
        type: t('script-error'),
        title: t('Error in search app'),
      }}
      logger={logger}
    >
      <Router basename={baseRouteName}>
        <Stack testId="search-box">
          <Routes>
            <Route path="/" element={<Navigate to={routes[RESULTS]} replace />} />
            <Route path={routes[RESULTS]}>
              <Route
                path=":searchKeyword"
                element={<SearchPage showLoginModal={showLoginModal} isLoggedIn={isLoggedIn} />}
              />
              <Route
                path=""
                element={<SearchPage showLoginModal={showLoginModal} isLoggedIn={isLoggedIn} />}
              />
            </Route>
            <Route
              path={routes[SETTINGS]}
              element={<SettingsPage showLoginModal={showLoginModal} isLoggedIn={isLoggedIn} />}
            />
            <Route
              path={routes[ONBOARDING]}
              element={<OnboardingPage showLoginModal={showLoginModal} isLoggedIn={isLoggedIn} />}
            />
          </Routes>
        </Stack>
      </Router>
    </ErrorBoundary>
  );
};

export default AppRoutes;
