import DS from '@akashaorg/design-system';
import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { rootRoute } from '../../routes';
import SearchPage from './search-page';
import { RootComponentProps } from '@akashaorg/ui-awf-typings';
import { useGetLogin } from '@akashaorg/ui-awf-hooks';

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
          <Route path={`${rootRoute}/:searchKeyword?`}>
            <SearchPage {...props} showLoginModal={showLoginModal} loginState={loginQuery.data} />
          </Route>
        </Switch>
      </Box>
    </Router>
  );
};

export default Routes;
