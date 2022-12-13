import React from 'react';
import DS from '@akashaorg/design-system';
import routes, { Landing } from '../routes';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './landing/landing-page';
import { RootComponentProps } from '@akashaorg/typings/ui';

const { Box } = DS;

const AppRoutes: React.FC<RootComponentProps> = props => {
  return (
    <Router basename={props.baseRouteName}>
      <Box>
        <Routes>
          <Route path={routes[Landing]} element={<LandingPage {...props} />} />
          <Route path="/" element={<Navigate to={routes[Landing]} replace />} />
        </Routes>
      </Box>
    </Router>
  );
};

export default AppRoutes;
