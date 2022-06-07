import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import DS from '@akashaorg/design-system';
import { useCheckModerator, useGetLogin } from '@akashaorg/ui-awf-hooks';
import { RootComponentProps } from '@akashaorg/ui-awf-typings';

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
        <Routes>
          <Route
            path={routes[UNAUTHENTICATED]}
            element={
              <IntroPage {...props} user={loginQuery.data?.pubKey} isAuthorised={isAuthorised} />
            }
          />
          <Route
            path={routes[GUEST]}
            element={
              <GuestPage {...props} user={loginQuery.data?.pubKey} isAuthorised={isAuthorised} />
            }
          />
          <Route
            path={routes[HOME]}
            element={
              <Dashboard
                {...props}
                user={loginQuery.data?.pubKey}
                isAuthorised={isAuthorised}
                slotId={layoutConfig.modalSlotId}
              />
            }
          />
          <Route
            path={routes[HISTORY]}
            element={
              <TransparencyLog
                user={loginQuery.data?.pubKey}
                navigateTo={props.plugins?.routing?.navigateTo}
              />
            }
          />
          <Route path={rootRoute} element={<Navigate to={routes[HOME]} replace />} />
        </Routes>
      </Router>
    </Box>
  );
};

export default AppRoutes;
