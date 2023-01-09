import React from 'react';
import DS, { BoxExtendedProps } from '@akashaorg/design-system';
import { IconProps } from '@akashaorg/design-system/lib/components/Icon';

export interface IBoxedIconProps {
  iconType: string;
  iconSize?: IconProps['size'];
  boxSize?: BoxExtendedProps['width'];
  backgroundColor?: string;
}

const { Box, Icon } = DS;

const BoxedIcon: React.FC<IBoxedIconProps> = props => {
  const { iconType, iconSize = 'md', boxSize = 'xsmall', backgroundColor } = props;

  return (
    <Box
      direction="row"
      width={boxSize}
      height={boxSize}
      round="small"
      align="center"
      justify="center"
      background={backgroundColor}
    >
      <Icon type={iconType} size={iconSize} plain={true} />
    </Box>
  );
};

export default BoxedIcon;
