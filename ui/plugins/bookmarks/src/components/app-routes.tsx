import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as React from 'react';
import DS from '@akashaproject/design-system';
import routes, { BOOKMARKS } from '../routes';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import BookmarksPage from './bookmarks-page';

const { Helmet } = DS;

const Routes = (props: RootComponentProps) => {
  return (
    <Router>
      <Helmet>
        <title>My Bookmarks | Ethereum World</title>
      </Helmet>
      <Route path={`${routes[BOOKMARKS]}`}>
        <BookmarksPage {...props} />
      </Route>
    </Router>
  );
};

export default Routes;
