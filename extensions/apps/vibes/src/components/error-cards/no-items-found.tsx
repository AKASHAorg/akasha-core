import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { Vibes } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
export type NoItemsFoundProps = {
  titleLabel: string;
  subtitleLabel: string;
};
const NoItemsFound: React.FC<NoItemsFoundProps> = ({ titleLabel, subtitleLabel }) => {
  return (
    <Stack padding="pt-6 px-2 pb-2">
      <Vibes className="h-6 w-6 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />

      <Typography bold className="text-center">
        {titleLabel}
      </Typography>

      <Typography className="text-center">{subtitleLabel}</Typography>
    </Stack>
  );
};
export default NoItemsFound;
