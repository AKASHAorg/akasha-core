import React, { createContext, useEffect, useMemo } from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { useNavigate } from '@tanstack/react-router';
import { Outlet, useMatchRoute } from '@tanstack/react-router';

import routes, { EDIT_EXTENSION } from '../../../routes';
import { useTranslation } from 'react-i18next';
import { NotConnnected } from '../../not-connected';
import { hasOwn, useAkashaStore } from '@akashaorg/ui-awf-hooks';
import { useGetAppsByIdQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import {
  AkashaAppApplicationType,
  AppImageSource,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';

export const AtomContext = createContext(null);

export type FormData = {
  lastCompletedStep?: number;
  extensionType?: AkashaAppApplicationType;
  extensionID?: string;
  extensionName?: string;
  logoImage?: AppImageSource;
  coverImage?: AppImageSource;
};

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
          extensionType: AkashaAppApplicationType.App,
          extensionID: '',
          extensionName: '',
          logoImage: { src: '' },
          coverImage: { src: '' },
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
    <Card>
      <Stack>
        <AtomContext.Provider value={formData}>
          <Outlet />
        </AtomContext.Provider>
      </Stack>
    </Card>
  );
};
