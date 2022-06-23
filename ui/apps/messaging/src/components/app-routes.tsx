import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import * as React from 'react';
import DS from '@akashaorg/design-system';
import routes, { MESSAGING } from '../routes';
import { RootComponentProps } from '@akashaorg/ui-awf-typings';

const { Helmet } = DS;

const AppRoutes: React.FC<RootComponentProps> = () => {
  return (
    <Router>
      <Routes>
        <Helmet>
          <title>My Bookmarks | Ethereum World</title>
        </Helmet>
        <Route path={`${routes[MESSAGING]}`}>
          <div>Messaging App Content</div>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
