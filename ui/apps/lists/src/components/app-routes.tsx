import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';

import ListsPage from './lists-page';
import Helmet from '@akashaorg/design-system-core/lib/components/Helmet';

const AppRoutes = () => {
  const { baseRouteName } = useRootComponentProps();

  return (
    <Router basename={baseRouteName}>
      <Helmet>
        <title>My List | AKASHA World</title>
      </Helmet>
      <Routes>
        <Route path="/" element={<ListsPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
