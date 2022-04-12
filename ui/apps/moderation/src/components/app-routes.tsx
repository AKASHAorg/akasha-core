import * as React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import DS from '@akashaproject/design-system';
import { useCheckModerator, useGetLogin } from '@akashaproject/ui-awf-hooks';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';

import TransparencyLog from './transparency-log';

import { Dashboard, GuestPage, IntroPage } from '../pages';

import routes, { GUEST, HISTORY, HOME, UNAUTHENTICATED, rootRoute } from '../routes';

const { Box } = DS;

const AppRoutes: React.FC<RootComponentProps> = props => {
  const { layoutConfig } = props;

  const loginQuery = useGetLogin();

  const checkModeratorQuery = useCheckModerator(loginQuery.data?.pubKey);
  const checkModeratorResp = checkModeratorQuery.data;

  const isAuthorised = React.useMemo(() => checkModeratorResp === 200, [checkModeratorResp]);

  return (
    <Box>
      <Router>
        <Switch>
          <Route path={routes[UNAUTHENTICATED]}>
            <IntroPage {...props} user={loginQuery.data?.pubKey} isAuthorised={isAuthorised} />
          </Route>
          <Route path={routes[GUEST]}>
            <GuestPage {...props} user={loginQuery.data?.pubKey} isAuthorised={isAuthorised} />
          </Route>
          <Route path={routes[HOME]}>
            <Dashboard
              {...props}
              user={loginQuery.data?.pubKey}
              isAuthorised={isAuthorised}
              slotId={layoutConfig.modalSlotId}
            />
          </Route>
          <Route path={routes[HISTORY]}>
            <TransparencyLog
              user={loginQuery.data?.pubKey}
              navigateTo={props.plugins?.routing?.navigateTo}
            />
          </Route>
          <Redirect exact={true} from={rootRoute} to={routes[HOME]} />
        </Switch>
      </Router>
    </Box>
  );
};

export default AppRoutes;
