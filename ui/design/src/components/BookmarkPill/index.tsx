import * as React from 'react';
import { Box, Text } from 'grommet';

import Icon from '../Icon';

export interface IBookmarkPill {
  infoLabel?: string;
  handleDismiss?: () => void;
}

const BookmarkPill: React.FC<IBookmarkPill> = props => {
  const { infoLabel, handleDismiss } = props;
  return (
    <Box
      direction="row"
      gap="small"
      pad="small"
      round="large"
      background={{ color: 'accent' }}
      fill="horizontal"
      width={{ max: '17rem' }}
      align="center"
      justify="center"
    >
      <Icon type="bookmark" color="white" size="sm" />
      <Text color="white">{infoLabel}</Text>
      <Icon type="close" onClick={handleDismiss} clickable={true} />
    </Box>
  );
};

BookmarkPill.defaultProps = {
  infoLabel: 'Succesfully saved bookmark',
};

export default BookmarkPill;
