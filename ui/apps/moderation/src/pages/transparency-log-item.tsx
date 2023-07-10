import React from 'react';
// import { useParams } from 'react-router-dom';

import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Box from '@akashaorg/design-system-core/lib/components/Box';

import Text from '@akashaorg/design-system-core/lib/components/Text';

export const TransparencyLogItem: React.FC = () => {
  // const { itemId } = useParams<{ itemId: string }>();

  const flexStyle = 'flex items-center justify-between';
  const value = 'Kept';

  return (
    <BasicCardBox pad="p-0 space-y-3">
      <Box
        customStyle={`p-4 space-y-2 rounded-t-2xl bg-(${
          value === 'Kept' ? 'success/10 dark:success/30' : 'errorLight/10 dark:errorDark/40'
        })`}
      >
        <Box customStyle={flexStyle}>
          <Text variant="h5">Social App</Text>

          <Text variant="body1">Case # S-21920</Text>
        </Box>
        <Box customStyle={flexStyle}>
          <Text variant="body1">Post</Text>

          <Box customStyle="flex space-x-1.5 items-center">
            <Box
              customStyle={`w-2 h-2 rounded-full ${
                value === 'Kept' ? 'bg-success' : 'bg-(errorLight dark:errorDark)'
              }`}
            />
            <Text variant="body2">{value}</Text>
          </Box>
        </Box>
        <Box customStyle={flexStyle}>
          <Text variant="body1">Reported 16-03-2022</Text>

          <Text variant="body1">Resolved 20-03-2022</Text>
        </Box>
      </Box>

      <Box customStyle="p-4">
        <Text variant="body1" color={{ light: 'grey5', dark: 'grey7' }}>
          A post has been reported for
        </Text>
      </Box>
    </BasicCardBox>
  );
};
