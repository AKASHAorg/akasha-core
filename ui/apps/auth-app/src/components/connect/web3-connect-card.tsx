import * as React from 'react';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import { IconProps } from '@akashaorg/design-system-core/lib/components/Icon';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import { IconType } from '@akashaorg/typings/ui';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import BoxedIcon, { BoxedIconProps } from './boxed-icon';

export interface IWeb3ConnectCardProps {
  titleLabel: string;
  subtitleLabel?: string;
  leftIconType: IconType;
  handleClick: () => void;
  iconSize?: IconProps['size'];
  iconColor?: IconProps['color'];
  boxSize?: BoxedIconProps['boxSize'];
  boxBgColor?: string;
}

const Web3ConnectCard: React.FC<IWeb3ConnectCardProps> = props => {
  const {
    titleLabel,
    subtitleLabel,
    leftIconType,
    handleClick,
    boxSize = 12,
    boxBgColor = 'white',
    iconColor,
    iconSize,
  } = props;

  return (
    <BasicCardBox
      elevation={'none'}
      accentBorder={true}
      customStyle="cursor-pointer select-none"
      onClick={handleClick}
    >
      <Box customStyle="flex items-center">
        <BoxedIcon
          iconColor={iconColor}
          iconSize={iconSize || 'lg'}
          iconType={leftIconType}
          boxSize={boxSize}
          background={`bg(${boxBgColor} dark:${boxBgColor})`}
        />
        <Box customStyle="flex flex-col ml-4">
          <Text weight="bold">{titleLabel}</Text>
          {subtitleLabel && <Text variant="body2">{subtitleLabel}</Text>}
        </Box>
      </Box>
    </BasicCardBox>
  );
};

export default Web3ConnectCard;
