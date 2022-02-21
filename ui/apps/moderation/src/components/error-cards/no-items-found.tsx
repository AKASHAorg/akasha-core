import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaproject/design-system';
import { I18N_NAMESPACE } from '../../services/constants';

const { Text } = DS;

export interface INoItemsFound {
  activeTab: string;
}

const NoItemsFound: React.FC<INoItemsFound> = ({ activeTab }) => {
  const { t } = useTranslation(I18N_NAMESPACE);
  return (
    <Text textAlign="center">
      {t('No {{activeTab}} items found. Please check again later', { activeTab })}
    </Text>
  );
};

export default NoItemsFound;
