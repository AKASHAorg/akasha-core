import React, { createContext, useMemo } from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Stepper from '@akashaorg/design-system-core/lib/components/Stepper';
import { Outlet } from '@tanstack/react-router';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { useAtomValue } from 'jotai';

import routes, { EDIT_EXTENSION } from '../../../routes';
import { useTranslation } from 'react-i18next';
import { NotConnnected } from '../../not-connected';
import { useAkashaStore } from '@akashaorg/ui-awf-hooks';
import { AppImageSource } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { ExtensionEditStep2FormValues } from '@akashaorg/design-system-components/lib/components/ExtensionEditStep2Form';

export const AtomContext = createContext(null);

const storage = createJSONStorage(() => sessionStorage);

export type FormData = {
  lastCompletedStep?: number;
  name?: string;
  displayName?: string;
  logoImage?: AppImageSource;
  coverImage?: AppImageSource;
  license?: string;
  contributors?: string[];
} & ExtensionEditStep2FormValues;

type ExtensionEditMainPageProps = {
  extensionId: string;
};

export const ExtensionEditMainPage: React.FC<ExtensionEditMainPageProps> = ({ extensionId }) => {
  const { t } = useTranslation('app-extensions');

  const {
    data: { authenticatedDID },
  } = useAkashaStore();

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
        },
        storage,
      ),
    [extensionId],
  );

  const formValue = useAtomValue(formData);

  StorageEvent;

  if (!authenticatedDID) {
    return (
      <NotConnnected
        description={t('To check your extensions you must be connected ⚡️')}
        redirectRoute={routes[EDIT_EXTENSION]}
      />
    );
  }
  return (
    <Card padding={0}>
      <Stack padding={16} justify="center" align="center">
        <Stepper length={4} currentStep={formValue.lastCompletedStep + 1} />
      </Stack>
      <AtomContext.Provider value={formData}>
        <Outlet />
      </AtomContext.Provider>
    </Card>
  );
};
