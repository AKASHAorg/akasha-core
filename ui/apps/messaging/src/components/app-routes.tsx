import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as React from 'react';
import DS from '@akashaorg/design-system';
import routes, { MESSAGING } from '../routes';
import { RootComponentProps } from '@akashaorg/ui-awf-typings';

const { Helmet } = DS;

const AppRoutes: React.FC<RootComponentProps> = () => {
  return (
    <Router>
      <Helmet>
        <title>My Bookmarks | Ethereum World</title>
      </Helmet>
      <Route path={`${routes[MESSAGING]}`}>
        <div>Messaging App Content</div>
      </Route>
    </Router>
  );
};

export default AppRoutes;
