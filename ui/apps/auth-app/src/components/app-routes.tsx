import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import routes, { CONNECT } from '../routes';
import Connect from './connect';

const AppRoutes: React.FC<unknown> = () => {
  const { baseRouteName } = useRootComponentProps();

  return (
    <Box>
      <Router basename={baseRouteName}>
        <Routes>
          <Route path={`${routes[CONNECT]}/*`} element={<Connect />} />
          <Route path="/" element={<Navigate to={routes.Connect} replace />} />
        </Routes>
      </Router>
    </Box>
  );
};

export default AppRoutes;
