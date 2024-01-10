import * as React from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import ErrorBoundary from '@akashaorg/design-system-core/lib/components/ErrorBoundary';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import AppRoutes from './app-routes';

const Application: React.FC<unknown> = () => {
  const { logger, getTranslationPlugin } = useRootComponentProps();
  const { t } = useTranslation('app-settings-ewa');

  return (
    <ErrorBoundary
      errorObj={{
        type: t('script-error'),
        title: t('Error in settings app'),
      }}
      logger={logger}
    >
      <React.Suspense fallback={<Spinner />}>
        <I18nextProvider i18n={getTranslationPlugin().i18n}>
          <AppRoutes />
        </I18nextProvider>
      </React.Suspense>
    </ErrorBoundary>
  );
};

export default Application;
