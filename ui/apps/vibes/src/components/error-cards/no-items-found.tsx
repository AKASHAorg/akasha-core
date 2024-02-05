import React from 'react';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { Vibe } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type NoItemsFoundProps = {
  titleLabel: string;
  subtitleLabel: string;
};

const NoItemsFound: React.FC<NoItemsFoundProps> = ({ titleLabel, subtitleLabel }) => {
  return (
    <Stack padding="pt-6 px-2 pb-2">
      <Icon icon={<Vibe />} size="lg" accentColor={true} />

      <Text align="center" weight="bold">
        {titleLabel}
      </Text>

      <Text align="center">{subtitleLabel}</Text>
    </Stack>
  );
};

export default NoItemsFound;
