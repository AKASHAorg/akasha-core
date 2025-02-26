import React, { createContext, useMemo } from 'react';
import appRoutes, { WORLD_CONFIG_FORM } from '../../../routes';
import { useTranslation } from 'react-i18next';
import { Outlet } from '@tanstack/react-router';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { useAkashaStore, useRootComponentProps } from '@akashaorg/ui-core-hooks';
import {
  ErrorLoader,
  ErrorLoaderTitle,
  ErrorLoaderDescription,
  ErrorLoaderFooter,
} from '@akashaorg/ui/lib/akasha-components/error-loader';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

export const AtomContext = createContext(null);

const storage = createJSONStorage(() => sessionStorage);

export type FormData = {
  layoutExtension?: string;
  registryExtension?: string;
  homepageExtension?: string;
  extensions?: string[];
};

type WorldConfigMainPageProps = {
  worldId: string;
};

export const WorldConfigMainPage: React.FC<WorldConfigMainPageProps> = ({ worldId }) => {
  const { t } = useTranslation('app-extensions');

  const { baseRouteName, getCorePlugins } = useRootComponentProps();
  const navigateTo = getCorePlugins().routing.navigateTo;

  const {
    data: { authenticatedDID },
  } = useAkashaStore();

  const handleConnectButtonClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-auth-ewa',
      getNavigationUrl: (routes: Record<string, string>) => {
        return `${routes.Connect}?${new URLSearchParams({
          redirectTo: `${baseRouteName}/${appRoutes[WORLD_CONFIG_FORM]}/step1`,
        }).toString()}`;
      },
    });
  };

  const formData = useMemo(
    () =>
      atomWithStorage<FormData>(
        worldId,
        {
          layoutExtension: '',
          registryExtension: '',
          homepageExtension: '',
          extensions: [],
        },
        storage,
      ),
    [worldId],
  );

  if (!authenticatedDID) {
    return (
      <ErrorLoader type="not-authenticated">
        <ErrorLoaderTitle>{`${t('Uh-oh')}! ${t('You are not connected')}!`}</ErrorLoaderTitle>
        <ErrorLoaderDescription>
          {`${t('To create a world configuration you must be connected')} ⚡️`}
        </ErrorLoaderDescription>
        <ErrorLoaderFooter>
          <Button variant="default" size="default" onClick={handleConnectButtonClick}>
            {t('Connect')}
          </Button>
        </ErrorLoaderFooter>
      </ErrorLoader>
    );
  }

  return (
    <Card>
      <AtomContext.Provider value={formData}>
        <Outlet />
      </AtomContext.Provider>
    </Card>
  );
};
