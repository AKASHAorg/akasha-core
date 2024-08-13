import React, { createContext, useMemo } from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Stepper from '@akashaorg/design-system-core/lib/components/Stepper';
import { Outlet } from '@tanstack/react-router';
import routes, { EDIT_EXTENSION } from '../../../routes';
import { useTranslation } from 'react-i18next';
import { NotConnnected } from '../../not-connected';
import { useAkashaStore } from '@akashaorg/ui-awf-hooks';
import { AppImageSource } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { ExtensionEditStep2FormValues } from '@akashaorg/design-system-components/lib/components/ExtensionEditStep2Form';

export const AtomContext = createContext(null);

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

  const formValue = useMemo(
    () => JSON.parse(sessionStorage.getItem(extensionId)) || {},
    [extensionId],
  );

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
        <Stepper length={4} currentStep={(formValue.lastCompletedStep || 0) + 1} />
      </Stack>
      <Outlet />
    </Card>
  );
};
