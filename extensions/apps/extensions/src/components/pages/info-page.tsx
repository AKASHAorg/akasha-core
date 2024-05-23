import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Text from '@akashaorg/design-system-core/lib/components/Text';

type InfoPageProps = {
  appId: string;
};

export const InfoPage: React.FC<InfoPageProps> = () => {
  const { t } = useTranslation('app-extensions');

  return <Text variant="h5">{t('Extension Info')}</Text>;
};
