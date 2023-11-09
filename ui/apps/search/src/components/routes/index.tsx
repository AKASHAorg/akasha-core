import * as React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { useRootComponentProps, useLoggedIn } from '@akashaorg/ui-awf-hooks';
import SearchPage from './search-page';
import OnboardingPage from './onboarding-page';
import SettingsPage from './settings-page';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

import routes, { ONBOARDING, RESULTS, SETTINGS } from '../../routes';

const AppRoutes: React.FC<unknown> = () => {
  const { baseRouteName, navigateToModal } = useRootComponentProps();

  const { isLoggedIn, loggedInProfileId } = useLoggedIn();

  const showLoginModal = () => {
    navigateToModal({ name: 'login' });
  };

  return (
    <Router basename={baseRouteName}>
      <Stack testId="search-box">
        <Routes>
          <Route path="/" element={<Navigate to={routes[RESULTS]} replace />} />
          <Route path={routes[RESULTS]}>
            <Route
              path=":searchKeyword"
              element={
                <SearchPage showLoginModal={showLoginModal} loggedInProfileId={loggedInProfileId} />
              }
            />
            <Route
              path=""
              element={
                <SearchPage showLoginModal={showLoginModal} loggedInProfileId={loggedInProfileId} />
              }
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
  );
};

export default AppRoutes;
