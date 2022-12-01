import React from 'react';

import DS from '@akashaorg/design-system';

const { Box, Icon, Text } = DS;

export interface INoItemsFound {
  titleLabel: string;
  subtitleLabel: string;
}

const NoItemsFound: React.FC<INoItemsFound> = ({ titleLabel, subtitleLabel }) => {
  return (
    <Box pad={{ top: 'xlarge', horizontal: 'small', bottom: 'small' }} align="center">
      <Icon type="appModeration" size="xxl" accentColor={true} />
      <Text size="large" textAlign="center" weight="bold">
        {titleLabel}
      </Text>
      <Text size="large" textAlign="center" margin={{ top: 'small' }}>
        {subtitleLabel}
      </Text>
    </Box>
  );
};

export default NoItemsFound;
