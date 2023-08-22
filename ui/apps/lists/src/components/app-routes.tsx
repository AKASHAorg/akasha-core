import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import * as React from 'react';
import { RootComponentProps } from '@akashaorg/typings/ui';
import ListsPage from './lists-page';
import Helmet from '@akashaorg/design-system-core/lib/components/Helmet';

const AppRoutes = (props: RootComponentProps) => {
  return (
    <Router basename={props.baseRouteName}>
      <Helmet>
        <title>My List | AKASHA World</title>
      </Helmet>
      <Routes>
        <Route path="/" element={<ListsPage {...props} />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
