import React, { useEffect } from 'react';
import {
  ErrorLoader,
  ErrorLoaderDescription,
  ErrorLoaderTitle,
  ErrorLoaderFooter,
} from '@akashaorg/ui/lib/akasha-components/error-loader';
import { useTranslation } from 'react-i18next';
import { useRootComponentProps } from '@akashaorg/ui-core-hooks';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';

export const NotFoundComponent = (props: { error?: Error; reset?: (key: string) => void }) => {
  const { t } = useTranslation();
  const { getCorePlugins, logger, worldConfig } = useRootComponentProps();

  useEffect(() => {
    if (props.error) {
      logger.warn(`Error in Settings app: ${props.error}`);
    }
  }, [logger, props.error]);

  const navigateHome = () => {
    getCorePlugins().routing.navigateTo({
      appName: worldConfig.homepageApp,
      getNavigationUrl: () => '/',
    });
  };

  return (
    <ErrorLoader type="page-not-found">
      <ErrorLoaderTitle>{`${t('Oops!')} ${t('Page not found')}`}</ErrorLoaderTitle>
      <ErrorLoaderDescription>
        {t(
          'This error means that the webpage you were trying to reach does not exist on {{worldTitle}}. It may have been moved, deleted, or the URL might be incorrect.',
          { worldTitle: worldConfig.title },
        )}
      </ErrorLoaderDescription>
      <ErrorLoaderFooter>
        <Button onClick={navigateHome}>{t('Home')}</Button>
      </ErrorLoaderFooter>
    </ErrorLoader>
  );
};
