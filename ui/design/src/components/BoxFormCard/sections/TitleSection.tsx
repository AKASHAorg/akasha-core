import React from 'react';
import { Box, Text } from 'grommet';

import Icon from '../../Icon';

export interface ITitleSectionProps {
  titleLabel?: string;
  iconType?: string;
  onIconClick?: () => void;
}

const TitleSection: React.FC<ITitleSectionProps> = props => {
  const { titleLabel, iconType, onIconClick } = props;

  if (iconType && onIconClick) {
    return (
      <Box direction="row" align="center" margin={{ bottom: 'medium' }}>
        <Icon type={iconType} onClick={onIconClick} style={{ cursor: 'pointer' }} />
        <Text
          size="large"
          weight="bold"
          textAlign="center"
          margin={{ vertical: '0', horizontal: 'auto' }}
          style={{ userSelect: 'none' }}
        >
          {titleLabel}
        </Text>
      </Box>
    );
  }
  return (
    <Box direction="column" pad="xsmall">
      <Text
        size="large"
        weight="bold"
        textAlign="center"
        style={{ userSelect: 'none', paddingBottom: '1.5em' }}
      >
        {titleLabel}
      </Text>
    </Box>
  );
};

export { TitleSection };
