import * as React from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import {
  ErrorLoader,
  ErrorLoaderDescription,
  ErrorLoaderFooter,
  ErrorLoaderTitle,
} from '@akashaorg/ui/lib/akasha-components/error-loader';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { useTranslation } from 'react-i18next';
import { Extension } from '@akashaorg/ui-lib-extensions/lib/react/extension';
import { useAkashaStore, useRootComponentProps } from '@akashaorg/ui-core-hooks';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const EditorPage: React.FC<unknown> = () => {
  const {
    data: { authenticatedDID },
  } = useAkashaStore();
  const { getCorePlugins } = useRootComponentProps();
  const navigateTo = React.useRef(getCorePlugins().routing.navigateTo);
  const { t } = useTranslation();

  return (
    <HelmetProvider>
      <Stack className="w-full">
        <Helmet>
          <title>{t('Beam Editor')}</title>
        </Helmet>
        {!authenticatedDID && (
          <Stack>
            <ErrorLoader type={'not-authenticated'}>
              <ErrorLoaderTitle>{t('Uh-oh! You are not connected!')}</ErrorLoaderTitle>
              <ErrorLoaderDescription>
                {t('To create Beams you must be connected ⚡️')}
              </ErrorLoaderDescription>
              <ErrorLoaderFooter>
                <Button
                  onClick={() =>
                    navigateTo.current({
                      appName: '@akashaorg/app-auth-ewa',
                      getNavigationUrl: navRoutes =>
                        `${navRoutes.Connect}?redirectTo=${encodeURIComponent(location.pathname)}`,
                    })
                  }
                >
                  {t('Connect')}
                </Button>
              </ErrorLoaderFooter>
            </ErrorLoader>
          </Stack>
        )}
        {authenticatedDID && (
          <Stack className="mb-1">
            <Extension name="beam-editor_feed_page" />
          </Stack>
        )}
      </Stack>
    </HelmetProvider>
  );
};

export default EditorPage;
