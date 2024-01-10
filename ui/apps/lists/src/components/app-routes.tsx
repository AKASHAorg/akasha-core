import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import ErrorBoundary from '@akashaorg/design-system-core/lib/components/ErrorBoundary';
import ListsPage from './lists-page';
import Helmet from '@akashaorg/design-system-core/lib/components/Helmet';

const AppRoutes: React.FC<unknown> = () => {
  const { baseRouteName, logger } = useRootComponentProps();
  const { t } = useTranslation('app-lists');

  return (
    <ErrorBoundary
      errorObj={{
        type: t('script-error'),
        title: t('Error in lists app'),
      }}
      logger={logger}
    >
      <Router basename={baseRouteName}>
        <Helmet>
          <title>My List | AKASHA World</title>
        </Helmet>
        <Routes>
          <Route path="/" element={<ListsPage />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default AppRoutes;
