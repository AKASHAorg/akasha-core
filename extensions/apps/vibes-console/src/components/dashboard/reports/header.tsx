import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type ReportsHeaderProps = {
  introLabel: string;
  reportLabel: string;
};

export const ReportsHeader: React.FC<ReportsHeaderProps> = props => {
  const { introLabel, reportLabel } = props;
  return (
    <Card padding="p-4">
      <Stack spacing="gap-y-4">
        <Stack direction="row" align="center" justify="between">
          <Text variant="h6" color={{ light: 'grey5', dark: 'grey6' }}>
            {introLabel}
          </Text>
          <Stack
            padding="p-2"
            customStyle="w-fit rounded-full bg-(secondaryLight/30 dark:secondaryDark)"
          >
            <Text variant="footnotes2" color={{ light: 'secondaryLight', dark: 'grey2' }}>
              {reportLabel}
            </Text>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
};
