import React from 'react';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { Vibes } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type NoItemsFoundProps = {
  titleLabel: string;
  subtitleLabel: string;
};

const NoItemsFound: React.FC<NoItemsFoundProps> = ({ titleLabel, subtitleLabel }) => {
  return (
    <Stack padding="pt-6 px-2 pb-2">
      <Vibes className="h-6 w-6 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />

      <Text align="center" weight="bold">
        {titleLabel}
      </Text>

      <Text align="center">{subtitleLabel}</Text>
    </Stack>
  );
};

export default NoItemsFound;
