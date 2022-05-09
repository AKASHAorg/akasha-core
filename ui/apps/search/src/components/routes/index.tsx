import DS from '@akashaproject/design-system';
import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import routes, { ONBOARDING, RESULTS } from '../../routes';
import SearchPage from './search-page';
import OnboardingPage from './onboarding-page';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { useGetLogin } from '@akashaproject/ui-awf-hooks';

const { Box } = DS;

const Routes: React.FC<RootComponentProps> = props => {
  const loginQuery = useGetLogin();

  const showLoginModal = () => {
    props.navigateToModal({ name: 'login' });
  };

  return (
    <Router>
      <Box>
        <Switch>
          <Route path={`${routes[RESULTS]}/:searchKeyword?`}>
            <SearchPage {...props} showLoginModal={showLoginModal} loginState={loginQuery.data} />
          </Route>
          <Route path={`${routes[ONBOARDING]}`}>
            <OnboardingPage
              {...props}
              showLoginModal={showLoginModal}
              loginState={loginQuery.data}
            />
          </Route>
        </Switch>
      </Box>
    </Router>
  );
};

export default Routes;
