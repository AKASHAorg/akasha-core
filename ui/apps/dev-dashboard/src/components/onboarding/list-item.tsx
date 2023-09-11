import React from 'react';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type ListItemProps = {
  listElementText: string;
  item: string;
};

export const ListItem: React.FC<ListItemProps> = props => {
  const { listElementText, item } = props;

  return (
    <Stack direction="row" spacing="gap-x-1">
      <Text>{listElementText}</Text>
      <Text>{item}</Text>
    </Stack>
  );
};
