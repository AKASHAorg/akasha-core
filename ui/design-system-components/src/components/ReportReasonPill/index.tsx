import React from 'react';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { FlagIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type ReportReasonPillProps = {
  reportCount: number;
  reason: string;
};

const ReportReasonPill: React.FC<ReportReasonPillProps> = props => {
  const { reason, reportCount } = props;

  return (
    <Stack
      direction="row"
      customStyle="w-fit rounded-full bg-(secondaryLight/30 dark:secondaryDark/30)"
    >
      <Stack direction="row" align="center" spacing="gap-x-1" padding="p-2">
        <Icon
          icon={<FlagIcon />}
          size="sm"
          color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
        />
        <Text variant="footnotes2" color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>
          {reportCount}
        </Text>
      </Stack>

      <Stack padding="p-2" customStyle="border(l-1 solid white dark:grey2)">
        <Text variant="footnotes2" color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>
          {reason}
        </Text>
      </Stack>
    </Stack>
  );
};

export default ReportReasonPill;
