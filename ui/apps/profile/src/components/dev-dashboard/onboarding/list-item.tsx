import React from 'react';

import DS from '@akashaorg/design-system';

const { Box, Text } = DS;

interface IListItemProps {
  marginBottom?: string;
  listElementText: string;
  item: string;
}

const ListItem: React.FC<IListItemProps> = props => {
  const { listElementText, item, marginBottom = 'large' } = props;

  return (
    <Box direction="row" margin={{ top: 'large' }}>
      <Text size="large" margin={{ right: 'xsmall' }}>
        {listElementText}
      </Text>
      <Text size="large" margin={{ bottom: marginBottom }}>
        {item}
      </Text>
    </Box>
  );
};

export default ListItem;
