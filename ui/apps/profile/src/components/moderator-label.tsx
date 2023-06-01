import React from 'react';

import DS from '@akashaorg/design-system';

const { BasicCardBox, Box, Icon, Text } = DS;

export interface IModeratorLabelProps {
  iconType?: string;
  label: string;
}

const ModeratorLabel: React.FC<IModeratorLabelProps> = props => {
  const { iconType = 'akasha', label } = props;

  return (
    <BasicCardBox direction="row" pad="medium" align="center" gap="small">
      <Box
        direction="row"
        justify="center"
        align="center"
        width="2rem"
        height="2rem"
        round="100%"
        background="hoverBackground"
      >
        <Icon type={iconType} size="md" />
      </Box>
      <Text size="large">{label}</Text>
    </BasicCardBox>
  );
};

export default ModeratorLabel;
