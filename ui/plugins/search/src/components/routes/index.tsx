import DS from '@akashaproject/design-system';
import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { rootRoute } from '../../routes';
import SearchPage from './search-page';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { useLoginState, useModalState, useErrors, useProfile } from '@akashaproject/ui-awf-hooks';

const { Box } = DS;

const Routes: React.FC<RootComponentProps> = props => {
  const [, errorActions] = useErrors({ logger: props.logger });

  const [loginState] = useLoginState({
    onError: errorActions.createError,
  });

  const [loginProfile] = useProfile({
    onError: errorActions.createError,
  });

  const [modalState, modalStateActions] = useModalState({
    initialState: {
      editor: false,
      report: false,
    },
    isLoggedIn: !!loginState.ethAddress,
  });

  const showLoginModal = () => {
    props.navigateToModal({ name: 'login' });
  };

  return (
    <Router>
      <Box>
        <Switch>
          <Route path={`${rootRoute}/:searchKeyword`}>
            <SearchPage
              {...props}
              logger={props.logger}
              sdkModules={props.sdkModules}
              singleSpa={props.singleSpa}
              globalChannel={props.globalChannel}
              modalState={modalState}
              modalStateActions={modalStateActions}
              showLoginModal={showLoginModal}
              loginState={loginState}
              loggedProfileData={loginProfile}
            />
          </Route>
        </Switch>
      </Box>
    </Router>
  );
};

export default Routes;
