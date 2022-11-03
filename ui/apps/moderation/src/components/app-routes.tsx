import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DS from '@akashaorg/design-system';
import { useCheckModerator, useGetLogin } from '@akashaorg/ui-awf-hooks';
import { RootComponentProps } from '@akashaorg/typings/ui';

import TransparencyLog from './transparency-log';
import { Dashboard, Overview, ValuePage } from '../pages';

import routes, { DASHBOARD, HISTORY, HOME, MODERATION_VALUE } from '../routes';

const { Box } = DS;

const AppRoutes: React.FC<RootComponentProps> = props => {
  const { layoutConfig } = props;

  const loginQuery = useGetLogin();

  const checkModeratorQuery = useCheckModerator(loginQuery.data?.pubKey);
  const checkModeratorResp = checkModeratorQuery.data;

  const isAuthorised = React.useMemo(() => checkModeratorResp === 200, [checkModeratorResp]);

  return (
    <Box>
      <Router basename={props.baseRouteName}>
        <Routes>
          <Route path={routes[HOME]} element={<Overview {...props} />} />

          <Route path={routes[MODERATION_VALUE]} element={<ValuePage {...props} />} />

          <Route
            path={routes[DASHBOARD]}
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
                navigateTo={props.plugins['@akashaorg/app-routing']?.routing?.navigateTo}
              />
            }
          />

          <Route path="/" element={<Navigate to={routes[HOME]} replace />} />
        </Routes>
      </Router>
    </Box>
  );
};

export default AppRoutes;
