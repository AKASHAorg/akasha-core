import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as React from 'react';
import DS from '@akashaorg/design-system';
import { RootComponentProps } from '@akashaorg/typings/ui';
import routes, { MESSAGING } from '../routes';

const { Helmet } = DS;

const AppRoutes: React.FC<RootComponentProps> = props => {
  return (
    <Router basename={props.baseRouteName}>
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
