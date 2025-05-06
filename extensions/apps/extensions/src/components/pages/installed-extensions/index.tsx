import React from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { useTranslation } from 'react-i18next';
import { DefaultExtensionsList } from './default-extensions-list';
import { InstalledExtensionsList } from './installed-extensions-list';

export const InstalledExtensionsPage: React.FC<unknown> = () => {
  const { t } = useTranslation('app-extensions');

  return (
    <Stack spacing={4} className="mb-2">
      <Typography variant="h5">{t('Installed Extensions')}</Typography>
      <InstalledExtensionsList />
      <DefaultExtensionsList />
    </Stack>
  );
};
