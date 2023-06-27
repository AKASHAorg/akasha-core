import React from 'react';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';

export interface IMiniHeaderProps {
  titleLabel: string;
  onClickIcon: () => void;
}

const MiniHeader: React.FC<IMiniHeaderProps> = props => {
  const { titleLabel, onClickIcon } = props;

  return (
    <BasicCardBox pad="p-2">
      <Box customStyle="flex flex-row w-full">
        <button onClick={onClickIcon}>
          <Icon type="ChevronLeftIcon" />
        </button>
        <Text variant="h2">{titleLabel}</Text>
      </Box>
    </BasicCardBox>
  );
};

export default MiniHeader;
