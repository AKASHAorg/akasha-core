import React from 'react';
import { Box, Text } from 'grommet';

import Icon from '../Icon';

interface ISectionTitleProps {
  titleLabel: string;
  subtitleLabel?: string;
}

const SectionTitle: React.FC<ISectionTitleProps> = props => {
  const { titleLabel, subtitleLabel } = props;
  return (
    <Box
      direction="row"
      justify="start"
      align="start"
      fill={true}
      margin={{ bottom: 'xsmall' }}
      pad={{ horizontal: 'medium' }}
    >
      <Icon type="app" plain={true} />
      <Box margin={{ left: 'medium' }}>
        <Text
          weight={700}
          color="secondaryText"
          size="large"
          style={{ padding: '0rem', textTransform: 'uppercase' }}
        >
          {titleLabel}
        </Text>
        {subtitleLabel && (
          <Text size="medium" color="subtitleText">
            {subtitleLabel}
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default SectionTitle;
