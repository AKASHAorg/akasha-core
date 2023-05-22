import * as React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { RootComponentProps } from '@akashaorg/typings/ui';
import { useGetLogin } from '@akashaorg/ui-awf-hooks';
import routes, { ONBOARDING, RESULTS, SETTINGS } from '../../routes';
import SearchPage from './search-page';
import OnboardingPage from './onboarding-page';
import SettingsPage from './settings-page';
import Box from '@akashaorg/design-system-core/lib/components/Box';

const AppRoutes: React.FC<RootComponentProps> = props => {
  const loginQuery = useGetLogin();

  const showLoginModal = () => {
    props.navigateToModal({ name: 'login' });
  };

  return (
    <Router basename={props.baseRouteName}>
      <Box testId="search-box">
        <Routes>
          <Route path="/" element={<Navigate to={routes[RESULTS]} replace />} />
          <Route path={routes[RESULTS]}>
            <Route
              path=":searchKeyword"
              element={
                <SearchPage
                  {...props}
                  showLoginModal={showLoginModal}
                  loginState={loginQuery.data}
                />
              }
            />
            <Route
              path=""
              element={
                <SearchPage
                  {...props}
                  showLoginModal={showLoginModal}
                  loginState={loginQuery.data}
                />
              }
            />
          </Route>
          <Route
            path={routes[SETTINGS]}
            element={
              <SettingsPage
                {...props}
                showLoginModal={showLoginModal}
                loginState={loginQuery.data}
              />
            }
          />
          <Route
            path={routes[ONBOARDING]}
            element={
              <OnboardingPage
                {...props}
                showLoginModal={showLoginModal}
                loginState={loginQuery.data}
              />
            }
          />
        </Routes>
      </Box>
    </Router>
  );
};

export default AppRoutes;
