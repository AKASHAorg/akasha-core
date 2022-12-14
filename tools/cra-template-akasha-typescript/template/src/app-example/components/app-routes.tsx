import React from 'react';
import DS from '@akashaorg/design-system';
import routes, { Example } from '../routes';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ExamplePage } from './example/example-page';
import { RootComponentProps } from '@akashaorg/typings/ui';

const { Box } = DS;

const AppRoutes: React.FC<RootComponentProps> = props => {
  return (
    <Router basename={props.baseRouteName}>
      <Box>
        <Routes>
          <Route path={routes[Example]} element={<ExamplePage {...props} />} />
          <Route path="/" element={<Navigate to={routes[Example]} replace />} />
        </Routes>
      </Box>
    </Router>
  );
};

export default AppRoutes;
