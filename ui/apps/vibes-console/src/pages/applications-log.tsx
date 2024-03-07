import React from 'react';
import { useTranslation } from 'react-i18next';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export const ApplicationsLog: React.FC<unknown> = () => {
  const { t } = useTranslation('vibes-console');

  return (
    <Stack spacing="gap-y-4">
      <Text variant="h5">{t('Applications Log')}</Text>
    </Stack>
  );
};
