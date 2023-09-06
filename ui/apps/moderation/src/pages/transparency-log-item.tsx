import React from 'react';
// import { useParams } from 'react-router-dom';

import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

import Text from '@akashaorg/design-system-core/lib/components/Text';

export const TransparencyLogItem: React.FC = () => {
  // const { itemId } = useParams<{ itemId: string }>();

  const value = 'Kept';

  return (
    <Card padding={0} customStyle="space-y-3">
      <Stack
        spacing="gap-y-2"
        customStyle={`p-4 rounded-t-2xl bg-(${
          value === 'Kept' ? 'success/10 dark:success/30' : 'errorLight/10 dark:errorDark/40'
        })`}
      >
        <Stack direction="row" align="center" justify="between">
          <Text variant="h5">Social App</Text>

          <Text variant="body1">Case # S-21920</Text>
        </Stack>
        <Stack direction="row" align="center" justify="between">
          <Text variant="body1">Post</Text>

          <Stack align="center" spacing="gap-x-1.5">
            <Stack
              customStyle={`w-2 h-2 rounded-full ${
                value === 'Kept' ? 'bg-success' : 'bg-(errorLight dark:errorDark)'
              }`}
            />
            <Text variant="body2">{value}</Text>
          </Stack>
        </Stack>
        <Stack direction="row" align="center" justify="between">
          <Text variant="body1">Reported 16-03-2022</Text>

          <Text variant="body1">Resolved 20-03-2022</Text>
        </Stack>
      </Stack>

      <Stack customStyle="p-4">
        <Text variant="body1" color={{ light: 'grey5', dark: 'grey7' }}>
          A post has been reported for
        </Text>
      </Stack>
    </Card>
  );
};
