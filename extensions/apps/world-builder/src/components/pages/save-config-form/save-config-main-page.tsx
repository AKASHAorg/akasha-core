import React, { createContext } from 'react';
import { Outlet } from '@tanstack/react-router';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import appRoutes, { SAVE_CONFIG } from '../../../routes';
import { useTranslation } from 'react-i18next';
import { useAkashaStore, useRootComponentProps } from '@akashaorg/ui-core-hooks';
import {
  ErrorLoader,
  ErrorLoaderTitle,
  ErrorLoaderDescription,
  ErrorLoaderFooter,
} from '@akashaorg/ui/lib/akasha-components/error-loader';
import { Card } from '@akashaorg/ui/lib/components/Card';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';

export const SAVE_WORLD_CONFIG_FORM = 'save-world-config-form';

export const AtomContext = createContext(null);

const storage = createJSONStorage(() => sessionStorage);

export type FormData = {
  lastCompletedStep?: number;
  name?: string;
};

export const SaveConfigMainPage: React.FC = () => {
  const { t } = useTranslation('app-extensions');

  const { baseRouteName, getCorePlugins } = useRootComponentProps();

  const navigateTo = getCorePlugins().routing.navigateTo;

  const {
    data: { authenticatedDID },
  } = useAkashaStore();

  const formData = atomWithStorage<FormData>(
    SAVE_WORLD_CONFIG_FORM,
    {
      lastCompletedStep: 0,
      name: '',
    },
    storage,
  );

  const handleConnectButtonClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-auth-ewa',
      getNavigationUrl: (routes: Record<string, string>) => {
        return `${routes.Connect}?${new URLSearchParams({
          redirectTo: `${baseRouteName}/${appRoutes[SAVE_CONFIG]}/step1`,
        }).toString()}`;
      },
    });
  };

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
