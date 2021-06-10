import React from 'react';
import { Box, Text } from 'grommet';

export interface ITitleSectionProps {
  titleLabel?: string;
}

const TitleSection: React.FC<ITitleSectionProps> = props => {
  const { titleLabel } = props;
  return (
    <Box direction="column" pad="xsmall">
      <Text size="large" textAlign="center" style={{ userSelect: 'none', paddingBottom: '1.5em' }}>
        {titleLabel}
      </Text>
    </Box>
  );
};

export { TitleSection };
