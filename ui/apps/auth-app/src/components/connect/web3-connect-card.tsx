import * as React from 'react';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import { IconType } from '@akashaorg/typings/ui';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export interface IWeb3ConnectCardProps {
  titleLabel: string;
  subtitleLabel?: string;
  leftIconType: IconType;
  iconBackground?: string;
  handleClick: () => void;
}

const Web3ConnectCard: React.FC<IWeb3ConnectCardProps> = props => {
  const { titleLabel, subtitleLabel, leftIconType, handleClick } = props;

  return (
    <BasicCardBox customStyle="cursor-pointer border-1 rounded-md " onClick={handleClick}>
      <Box customStyle="flex items-center">
        <Icon type={leftIconType} size="lg" customStyle="mr-4" />
        <Box customStyle="flex flex-col">
          <Text weight="bold">{titleLabel}</Text>
          {subtitleLabel && <Text variant="body2">{subtitleLabel}</Text>}
        </Box>
      </Box>
    </BasicCardBox>
  );
};

export default Web3ConnectCard;
