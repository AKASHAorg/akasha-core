import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaproject/design-system';

const { Text } = DS;

export interface INoItemsFound {
  activeTab: string;
}

const NoItemsFound: React.FC<INoItemsFound> = ({ activeTab }) => {
  const { t } = useTranslation();
  return (
    <Text textAlign="center">{t(`No ${activeTab} items found. Please check again later`)}</Text>
  );
};

export default NoItemsFound;
