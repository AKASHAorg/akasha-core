import React from 'react';
import { Box } from 'grommet';

import Icon, { IconProps } from '../Icon';

export interface ISocialLinksProps {
  iconType: string;
  iconSize?: IconProps['size'];
  backgroundWidth?: string;
  backgroundHeight?: string;
  backgroundColor?: string;
  onClick: () => void;
}

const SocialLink: React.FC<ISocialLinksProps> = props => {
  const {
    iconType,
    iconSize = 'md',
    backgroundWidth = '2rem',
    backgroundHeight = '2rem',
    backgroundColor = 'hoverBackground',
    onClick,
  } = props;

  return (
    <Box
      direction="row"
      justify="center"
      align="center"
      width={backgroundWidth}
      height={backgroundHeight}
      round="100%"
      background={backgroundColor}
      onClick={onClick}
    >
      <Icon type={iconType} size={iconSize} />
    </Box>
  );
};

export default SocialLink;
