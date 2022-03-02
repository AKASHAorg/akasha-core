import React from 'react';
import { Box, Text } from 'grommet';

import Icon from '../Icon';

interface ISectionTitleProps {
  titleLabel: string;
}

const SectionTitle: React.FC<ISectionTitleProps> = props => {
  return (
    <Box direction="row" justify="start">
      <Icon type="app" plain={true} />
      <Text
        margin={{ left: 'medium' }}
        weight={700}
        color="secondaryText"
        size="large"
        style={{ padding: '0.5rem 0rem', textTransform: 'uppercase' }}
      >
        {props.titleLabel}
      </Text>
    </Box>
  );
};

export default SectionTitle;
