import React from 'react';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export interface IActivityTabProps {
  placeholder?: string;
}

export const ActivityTab: React.FC<IActivityTabProps> = props => {
  const { placeholder } = props;

  return (
    <Box customStyle="p-4 space-y-4">
      <Text>{placeholder} ...</Text>
    </Box>
  );
};
