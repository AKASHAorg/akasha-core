import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { useTranslation } from 'react-i18next';
import { DefaultExtensionsList } from './default-extensions-list';
import { InstalledExtensionsList } from './installed-extensions-list';

export const InstalledExtensionsPage: React.FC<unknown> = () => {
  const { t } = useTranslation('app-extensions');

  return (
    <Stack spacing="gap-y-4" customStyle="mb-2">
      <Text variant="h5">{t('Installed Extensions')}</Text>
      <InstalledExtensionsList />
      <DefaultExtensionsList />
    </Stack>
  );
};
