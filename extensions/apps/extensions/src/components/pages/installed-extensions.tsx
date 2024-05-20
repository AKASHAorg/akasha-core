import React from 'react';
import { useTranslation } from 'react-i18next';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export const InstalledExtensions: React.FC<unknown> = () => {
  const { t } = useTranslation('app-extensions');

  return <Text variant="h5">{t('Installed Extensions')}</Text>;
};
