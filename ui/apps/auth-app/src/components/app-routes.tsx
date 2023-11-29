import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import Connect from './connect';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import routes, { CONNECT } from '../routes';

const AppRoutes: React.FC<unknown> = () => {
  const { baseRouteName } = useRootComponentProps();

  return (
    <Stack>
      <Router basename={baseRouteName}>
        <Routes>
          <Route path={`${routes[CONNECT]}/*`} element={<Connect />} />
          <Route path="/" element={<Navigate to={routes.Connect} replace />} />
        </Routes>
      </Router>
    </Stack>
  );
};

export default AppRoutes;
