import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaproject/design-system';

const { Box, Icon, Text } = DS;

export interface INoItemsFound {
  activeTab: string;
}

const NoItemsFound: React.FC<INoItemsFound> = ({ activeTab }) => {
  const { t } = useTranslation('app-moderation-ewa');
  return (
    <Box pad={{ top: 'xlarge', horizontal: 'small', bottom: 'small' }} align="center">
      <Icon type="appModeration" size="xxl" accentColor={true} />
      <Text size="large" textAlign="center" weight="bold">
        {t('No {{activeTab}} items', { activeTab })}
      </Text>
      <Text size="large" textAlign="center" margin={{ top: 'small' }}>
        {t('There are no {{activeTab}} items at the moment. Please check back later', {
          activeTab,
        })}
      </Text>
    </Box>
  );
};

export default NoItemsFound;
