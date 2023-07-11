import React from 'react';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import { HeroImage, HeroImageProps } from './hero-image-card';

export type SummaryCardProps = HeroImageProps & {
  paragraph1TitleLabel: string;
  paragraph1Content?: string | Uint8Array;
  paragraph2TitleLabel: string;
  paragraph2Content?: string;
};

export const SummaryCard: React.FC<SummaryCardProps> = props => {
  const { paragraph1TitleLabel, paragraph1Content, paragraph2TitleLabel, paragraph2Content } =
    props;

  return (
    <Box customStyle="space-y-3">
      <HeroImage {...props} />

      <Box customStyle="rounded-lg space-y-2 p-4 bg-(grey9 dark:grey3)">
        <Text weight="bold">{paragraph1TitleLabel}</Text>

        {paragraph1Content && (
          <Text customStyle="break-all" color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>
            {paragraph1Content}
          </Text>
        )}

        <Divider />

        <Text weight="bold">{paragraph2TitleLabel}</Text>

        {paragraph2Content && (
          <Text customStyle="break-all" color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>
            {paragraph2Content}
          </Text>
        )}
      </Box>
    </Box>
  );
};
