import * as React from 'react';
import { Box, Text } from 'grommet';
import { RoundType } from 'grommet/utils';

export interface ITagProps {
  titleLabel: string;
  round?: RoundType;
  background?: string;
}

const Tag: React.FC<ITagProps> = props => {
  const { titleLabel, round, background } = props;
  return (
    <Box
      width="fit-content"
      margin={{ left: 'xsmall' }}
      pad={{ horizontal: 'xxsmall' }}
      round={round || 'xxsmall'}
      background={background || 'border'}
    >
      <Text>{titleLabel}</Text>
    </Box>
  );
};

export default Tag;
