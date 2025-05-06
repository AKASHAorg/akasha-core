import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { Vibes } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
export type NoItemsFoundProps = {
  titleLabel: string;
  subtitleLabel: string;
};
const NoItemsFound: React.FC<NoItemsFoundProps> = ({ titleLabel, subtitleLabel }) => {
  return (
    <Stack padding="pt-6 px-2 pb-2">
      <Icon icon={<Vibes />} size="lg" accentColor={true} />

      <Typography bold className="text-center">
        {titleLabel}
      </Typography>

      <Typography className="text-center">{subtitleLabel}</Typography>
    </Stack>
  );
};
export default NoItemsFound;
