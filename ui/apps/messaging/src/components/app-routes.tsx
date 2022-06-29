import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import * as React from 'react';
import DS from '@akashaorg/design-system';
import routes, { MESSAGING } from '../routes';
import { RootComponentProps } from '@akashaorg/ui-awf-typings';
import InboxPage from './inbox-page';

const { Helmet } = DS;

const AppRoutes: React.FC<RootComponentProps> = props => {
  return (
    <Router>
      <Helmet>
        <title>My Bookmarks | Ethereum World</title>
      </Helmet>
      <Routes>
        <Route path={`${routes[MESSAGING]}`} element={<InboxPage {...props} />}></Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
