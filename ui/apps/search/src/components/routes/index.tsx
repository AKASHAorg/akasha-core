import * as React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { useGetMyProfileQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import SearchPage from './search-page';
import OnboardingPage from './onboarding-page';
import SettingsPage from './settings-page';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

import routes, { ONBOARDING, RESULTS, SETTINGS } from '../../routes';

const AppRoutes: React.FC<unknown> = () => {
  const { baseRouteName, navigateToModal } = useRootComponentProps();

  const profileDataReq = useGetMyProfileQuery(null, {
    select: resp => {
      return resp.viewer?.akashaProfile;
    },
  });
  const loggedProfileData = profileDataReq.data;
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
                <SearchPage showLoginModal={showLoginModal} loggedProfileData={loggedProfileData} />
              }
            />
            <Route
              path=""
              element={
                <SearchPage showLoginModal={showLoginModal} loggedProfileData={loggedProfileData} />
              }
            />
          </Route>
          <Route
            path={routes[SETTINGS]}
            element={
              <SettingsPage showLoginModal={showLoginModal} loggedProfileData={loggedProfileData} />
            }
          />
          <Route
            path={routes[ONBOARDING]}
            element={
              <OnboardingPage
                showLoginModal={showLoginModal}
                loggedProfileData={loggedProfileData}
              />
            }
          />
        </Routes>
      </Stack>
    </Router>
  );
};

export default AppRoutes;
