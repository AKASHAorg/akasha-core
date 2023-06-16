import * as React from 'react';
import { RootComponentProps } from '@akashaorg/typings/ui';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import routes, { CONNECT, WELCOME } from '../routes';
import Connect from './connect';

const AppRoutes: React.FC<RootComponentProps> = props => {
  return (
    <Box>
      <Router basename={props.baseRouteName}>
        <Routes>
          <Route path={`${routes[CONNECT]}/*`} element={<Connect {...props} />} />
          <Route path="/" element={<Navigate to={routes.Connect} replace />} />
        </Routes>
      </Router>
    </Box>
  );
};

export default AppRoutes;
