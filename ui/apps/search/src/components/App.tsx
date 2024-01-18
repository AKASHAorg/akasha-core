import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import Helmet from '@akashaorg/design-system-core/lib/components/Helmet';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import AppRoutes from './routes';

const App: React.FC<unknown> = () => {
  const { getTranslationPlugin } = useRootComponentProps();

  return (
    <React.Suspense fallback={<Spinner />}>
      <I18nextProvider i18n={getTranslationPlugin().i18n}>
        <Helmet>
          <title>Search | AKASHA World</title>
        </Helmet>
        <AppRoutes />
      </I18nextProvider>
    </React.Suspense>
  );
};

export default App;
