import React from 'react';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type NoItemsFoundProps = {
  titleLabel: string;
  subtitleLabel: string;
};

const NoItemsFound: React.FC<NoItemsFoundProps> = ({ titleLabel, subtitleLabel }) => {
  return (
    <Box customStyle="pt-6 px-2 pb-2">
      <Icon type="appModeration" size="lg" accentColor={true} />

      <Text align="center" weight="bold">
        {titleLabel}
      </Text>

      <Text align="center">{subtitleLabel}</Text>
    </Box>
  );
};

export default NoItemsFound;
