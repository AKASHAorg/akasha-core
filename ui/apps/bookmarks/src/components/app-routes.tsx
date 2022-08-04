import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import * as React from 'react';
import DS from '@akashaorg/design-system';
import { RootComponentProps } from '@akashaorg/typings/ui';
import BookmarksPage from './bookmarks-page';

const { Helmet } = DS;

const AppRoutes = (props: RootComponentProps) => {
  return (
    <Router basename={props.baseRouteName}>
      <Helmet>
        <title>My Bookmarks | Ethereum World</title>
      </Helmet>
      <Routes>
        <Route path="/" element={<BookmarksPage {...props} />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
