import * as React from 'react';
import { RootComponentProps } from '@akashaorg/typings/ui';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import routes, { CONNECT, WELCOME } from '../routes';
import Connect from './connect';

const AppRoutes: React.FC<RootComponentProps> = props => {
  return (
    <Stack>
      <Router basename={props.baseRouteName}>
        <Routes>
          <Route path={`${routes[CONNECT]}/*`} element={<Connect {...props} />} />
          <Route path="/" element={<Navigate to={routes.Connect} replace />} />
        </Routes>
      </Router>
    </Stack>
  );
};

export default AppRoutes;
