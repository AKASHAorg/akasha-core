import React from 'react';
import Icon, { IconProps } from '@akashaorg/design-system-core/lib/components/Icon';
import { IconType } from '@akashaorg/typings/ui';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';

export type BoxedIconProps = {
  iconType: IconType;
  iconSize?: IconProps['size'];
  iconColor?: IconProps['color'];
  boxSize?: 0 | 6 | 12 | 24;
  background?: string;
  round?: string;
};

const BoxedIcon: React.FC<BoxedIconProps> = props => {
  return (
    <BasicCardBox
      pad="0"
      elevation={'none'}
      round={props.round || 'rounded-lg'}
      customStyle={`flex flex-row justify-center items-center w-${props.boxSize} h-${props.boxSize} ${props.background}`}
    >
      <Icon type={props.iconType} size={props.iconSize} color={props.iconColor} />
    </BasicCardBox>
  );
};

BoxedIcon.defaultProps = {
  boxSize: 24,
  iconSize: 'md',
};

export default BoxedIcon;
