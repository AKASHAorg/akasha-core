import React, { createContext, useMemo } from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import { Outlet } from '@tanstack/react-router';

import routes, { EDIT_EXTENSION } from '../../../routes';
import { useTranslation } from 'react-i18next';
import { NotConnnected } from '../../not-connected';
import { hasOwn, useAkashaStore } from '@akashaorg/ui-awf-hooks';
import { useGetAppsByIdQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { AppImageSource, AppProviderValue } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { ExtensionEditStep2FormValues } from '@akashaorg/design-system-components/lib/components/ExtensionEditStep2Form';

export const AtomContext = createContext(null);

export type FormData = {
  lastCompletedStep?: number;
  name?: string;
  displayName?: string;
  logoImage?: AppImageSource;
  coverImage?: AppImageSource;
  license?: string;
  meta?: AppProviderValue[];
  contributors?: string[];
} & ExtensionEditStep2FormValues;

type ExtensionEditMainPageProps = {
  extensionId: string;
};

export const ExtensionEditMainPage: React.FC<ExtensionEditMainPageProps> = ({ extensionId }) => {
  const { t } = useTranslation('app-extensions');

  const {
    data: { authenticatedProfile },
  } = useAkashaStore();

  const {
    data: appsByIdReq,
    error,
    loading,
  } = useGetAppsByIdQuery({
    variables: {
      id: extensionId,
    },
    skip: !authenticatedProfile?.did.id,
  });

  const appData = useMemo(() => {
    return appsByIdReq?.node && hasOwn(appsByIdReq?.node, 'id') ? appsByIdReq?.node : null;
  }, [appsByIdReq]);

  const storage = createJSONStorage(() => sessionStorage);

  const formData = useMemo(
    () =>
      atomWithStorage<FormData>(
        extensionId,
        {
          lastCompletedStep: 0,
          name: '',
          displayName: '',
          logoImage: { src: '' },
          coverImage: { src: '' },
          nsfw: false,
          description: '',
          gallery: [],
          links: [],
          contributors: [],
          license: '',
          meta: [],
        },
        storage,
      ),
    [],
  );

  if (!authenticatedProfile?.did.id) {
    return (
      <NotConnnected
        description={t('To check your extensions you must be connected ⚡️')}
        redirectRoute={routes[EDIT_EXTENSION]}
      />
    );
  }
  return (
    <Card padding={0}>
      <AtomContext.Provider value={formData}>
        <Outlet />
      </AtomContext.Provider>
    </Card>
  );
};
