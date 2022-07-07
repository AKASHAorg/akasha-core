import DS from '@akashaorg/design-system';
import * as React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import routes, { ONBOARDING, RESULTS } from '../../routes';
import SearchPage from './search-page';
import OnboardingPage from './onboarding-page';
import { RootComponentProps } from '@akashaorg/ui-awf-typings';
import { useGetLogin } from '@akashaorg/ui-awf-hooks';

const { Box } = DS;

const AppRoutes: React.FC<RootComponentProps> = props => {
  const loginQuery = useGetLogin();

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
