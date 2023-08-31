import * as React from 'react';
import { I18nextProvider } from 'react-i18next';
import AppRoutes from './app-routes';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';

const SocialApp = () => {
  const { getTranslationPlugin } = useRootComponentProps();

  return (
    <I18nextProvider i18n={getTranslationPlugin().i18n}>
      <AppRoutes />
    </I18nextProvider>
  );
};

export default SocialApp;
