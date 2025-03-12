import React, { createContext, useMemo } from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Outlet } from '@tanstack/react-router';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import appRoutes, { EDIT_PUBLISHED_EXTENSION } from '../../../routes';
import { useTranslation } from 'react-i18next';
import { useAkashaStore, useRootComponentProps } from '@akashaorg/ui-core-hooks';
import { AppImageSource, AppLinkSource } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import {
  ErrorLoader,
  ErrorLoaderDescription,
  ErrorLoaderFooter,
  ErrorLoaderTitle,
} from '@akashaorg/ui/lib/akasha-components/error-loader';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';

export const AtomContext = createContext(null);

const storage = createJSONStorage(() => sessionStorage);

export type FormData = {
  dataSavedToForm?: boolean;
  logoImage?: AppImageSource;
  coverImage?: AppImageSource;
  description?: string;
  gallery?: AppImageSource[];
  links?: AppLinkSource[];
};

type ExtensionEditPublishedMainPageProps = {
  extensionId: string;
};

export const formDefaultData = {
  dataSavedToForm: false,
  logoImage: { src: '' },
  coverImage: { src: '' },
  description: '',
  gallery: null,
  links: [],
};

export const ExtensionEditPublishedMainPage: React.FC<ExtensionEditPublishedMainPageProps> = ({
  extensionId,
}) => {
  const { t } = useTranslation('app-extensions');

  const { baseRouteName, getCorePlugins } = useRootComponentProps();

  const navigateTo = getCorePlugins().routing.navigateTo;

  const {
    data: { authenticatedDID },
  } = useAkashaStore();

  const formData = useMemo(
    () => atomWithStorage<FormData>(extensionId, formDefaultData, storage),
    [extensionId],
  );

  const handleConnectButtonClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-auth-ewa',
      getNavigationUrl: (routes: Record<string, string>) => {
        return `${routes.Connect}?${new URLSearchParams({
          redirectTo: `${baseRouteName}/${appRoutes[EDIT_PUBLISHED_EXTENSION]}/${extensionId}/form`,
        }).toString()}`;
      },
    });
  };

  if (!authenticatedDID) {
    return (
      <ErrorLoader type="not-authenticated">
        <ErrorLoaderTitle>{`${t('Uh-oh')}! ${t('You are not connected')}!`}</ErrorLoaderTitle>
        <ErrorLoaderDescription>{`${t('To check your extensions you must be connected')} ⚡️`}</ErrorLoaderDescription>
        <ErrorLoaderFooter>
          <Button onClick={handleConnectButtonClick}>{t('Connect')}</Button>
        </ErrorLoaderFooter>
      </ErrorLoader>
    );
  }

  return (
    <Card className="shadow-none p-0">
      <AtomContext.Provider value={formData}>
        <Outlet />
      </AtomContext.Provider>
    </Card>
  );
};
