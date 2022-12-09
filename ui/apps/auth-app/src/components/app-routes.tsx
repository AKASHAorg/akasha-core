import * as React from 'react';
import { RootComponentProps } from '@akashaorg/typings/ui';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DS from '@akashaorg/design-system';

import routes, { CONNECT, WELCOME } from '../routes';
import Welcome from './welcome';
import Connect from './connect';

const { Box } = DS;

const AppRoutes: React.FC<RootComponentProps> = props => {
  return (
    <Box>
      <Router basename={props.baseRouteName}>
        <Routes>
          <Route
            path={routes[WELCOME]}
            element={
              <div>
                <Welcome {...props} />
              </div>
            }
          />

          <Route
            path={routes[CONNECT]}
            element={
              <div>
                <Connect {...props} />
              </div>
            }
          />

          <Route path="/" element={<Navigate to={routes[CONNECT]} replace />} />
        </Routes>
      </Router>
    </Box>
  );
};

export default AppRoutes;
