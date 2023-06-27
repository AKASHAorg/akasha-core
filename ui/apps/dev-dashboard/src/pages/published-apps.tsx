import React from 'react';
import { useTranslation } from 'react-i18next';

import { RootComponentProps } from '@akashaorg/typings/ui';

import Text from '@akashaorg/design-system-core/lib/components/Text';

import { CardWrapper } from '../components/common';

export const PublishedApps: React.FC<RootComponentProps> = () => {
  const { t } = useTranslation('app-dev-dashboard');

  return (
    <CardWrapper titleLabel={t('Published Apps')}>
      <Text>{t('Coming soon.')}</Text>
    </CardWrapper>
  );
};
