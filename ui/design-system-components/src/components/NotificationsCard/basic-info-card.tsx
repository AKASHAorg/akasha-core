import React from 'react';

import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type BasicInfoCardProps = {
  titleLabel: string;
  subtitleLabel?: string;
  customStyle?: string;
};

const BasicInfoCard: React.FC<BasicInfoCardProps> = ({
  titleLabel,
  subtitleLabel,
  customStyle = '',
}) => {
  return (
    <Card padding={8} customStyle={`border-none ${customStyle}`}>
      <Stack direction="column" align="center" justify="center" customStyle="mb-32">
        <BasicCardBox
          customStyle="bg(grey8 dark:grey5) w-[180px] h-[180px] m-auto my-4"
          round="rounded-xl"
        />

        <Box customStyle="w-[50%] m-auto">
          {titleLabel && (
            <Text variant="h6" align="center">
              {titleLabel}
            </Text>
          )}

          {subtitleLabel && (
            <Text variant="footnotes2" align="center">
              {subtitleLabel}
            </Text>
          )}
        </Box>
      </Stack>
    </Card>
  );
};
export default BasicInfoCard;
