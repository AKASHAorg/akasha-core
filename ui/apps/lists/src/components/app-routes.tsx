import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import ErrorBoundary, {
  ErrorBoundaryProps,
} from '@akashaorg/design-system-core/lib/components/ErrorBoundary';
import ListsPage from './lists-page';
import { Helmet, helmetData } from '@akashaorg/design-system-core/lib/utils';

const AppRoutes: React.FC<unknown> = () => {
  const { baseRouteName, logger } = useRootComponentProps();
  const { t } = useTranslation('app-lists');

  const errorBoundaryProps: Pick<ErrorBoundaryProps, 'errorObj' | 'logger'> = {
    errorObj: {
      type: 'script-error',
      title: t('Error in lists app'),
    },
    logger,
  };

  return (
    <Router basename={baseRouteName}>
      <Helmet helmetData={helmetData}>
        <title>My List | AKASHA World</title>
      </Helmet>
      <Routes>
        <Route
          path="/"
          element={
            <ErrorBoundary {...errorBoundaryProps}>
              <ListsPage />
            </ErrorBoundary>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
