import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { Helmet, helmetData } from '@akashaorg/design-system-core/lib/utils';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import AppRoutes from './routes';

const App: React.FC<unknown> = () => {
  const { getTranslationPlugin, worldConfig } = useRootComponentProps();

  return (
    <React.Suspense fallback={<Spinner />}>
      <I18nextProvider i18n={getTranslationPlugin().i18n}>
        <Helmet helmetData={helmetData}>
          <title>Search | {worldConfig.title}</title>
        </Helmet>
        <AppRoutes />
      </I18nextProvider>
    </React.Suspense>
  );
};

export default App;
