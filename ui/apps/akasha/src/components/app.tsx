import * as React from 'react';
import { I18nextProvider } from 'react-i18next';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import AppRoutes from './app-routes';
import { BrowserRouter as Router } from 'react-router-dom';

const SocialApp: React.FC<unknown> = () => {
  const { getTranslationPlugin, baseRouteName } = useRootComponentProps();

  return (
    <React.StrictMode>
      <React.Suspense fallback={<Spinner />}>
        <I18nextProvider i18n={getTranslationPlugin().i18n}>
          <Router basename={baseRouteName}>
            <AppRoutes />
          </Router>
        </I18nextProvider>
      </React.Suspense>
    </React.StrictMode>
  );
};

export default SocialApp;
