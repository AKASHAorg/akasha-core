import DS from '@akashaorg/design-system';
import * as React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { RootComponentProps } from '@akashaorg/typings/ui';
import { useGetMyProfileQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import routes, { ONBOARDING, RESULTS } from '../../routes';
import SearchPage from './search-page';
import OnboardingPage from './onboarding-page';

const { Box } = DS;

const AppRoutes: React.FC<RootComponentProps> = props => {
  const profileDataReq = useGetMyProfileQuery(null, {
    select: resp => {
      return resp.viewer?.profile;
    },
  });
  const loggedProfileData = profileDataReq.data;
  const showLoginModal = () => {
    props.navigateToModal({ name: 'login' });
  };

  return (
    <Router basename={props.baseRouteName}>
      <Box>
        <Routes>
          <Route path="/" element={<Navigate to={routes[RESULTS]} replace />} />
          <Route path={routes[RESULTS]}>
            <Route
              path=":searchKeyword"
              element={
                <SearchPage
                  {...props}
                  showLoginModal={showLoginModal}
                  loggedProfileData={loggedProfileData}
                />
              }
            />
            <Route
              path=""
              element={
                <SearchPage
                  {...props}
                  showLoginModal={showLoginModal}
                  loggedProfileData={loggedProfileData}
                />
              }
            />
          </Route>
          <Route
            path={routes[ONBOARDING]}
            element={
              <OnboardingPage
                {...props}
                showLoginModal={showLoginModal}
                loggedProfileData={loggedProfileData}
              />
            }
          />
        </Routes>
      </Box>
    </Router>
  );
};

export default AppRoutes;
