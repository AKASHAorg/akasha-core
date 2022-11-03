import React from 'react';
import DS from '@akashaorg/design-system';

const { Box, Icon, MainAreaCardBox, Text } = DS;

export interface IMiniHeaderProps {
  titleLabel: string;
  onClickIcon: () => void;
}

const MiniHeader: React.FC<IMiniHeaderProps> = props => {
  const { titleLabel, onClickIcon } = props;

  return (
    <MainAreaCardBox pad="medium">
      <Box direction="row" fill="horizontal">
        <Icon type="chevronLeft" style={{ cursor: 'pointer' }} onClick={onClickIcon} />
        <Text size="xlarge" weight="bold">
          {titleLabel}
        </Text>
      </Box>
    </MainAreaCardBox>
  );
};

export default MiniHeader;
