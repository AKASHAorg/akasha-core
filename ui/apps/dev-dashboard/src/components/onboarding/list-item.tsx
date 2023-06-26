import React from 'react';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type ListItemProps = {
  listElementText: string;
  item: string;
};

export const ListItem: React.FC<ListItemProps> = props => {
  const { listElementText, item } = props;

  return (
    <Box customStyle="flex space-x-1">
      <Text>{listElementText}</Text>

      <Text>{item}</Text>
    </Box>
  );
};
