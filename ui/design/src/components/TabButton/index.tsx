import * as React from 'react';
import { Box, Text } from 'grommet';
import Icon, { IconType } from '../Icon';

export interface ITabButtonProps {
  className?: string;
  onClick?: () => void;
  active?: boolean;
  iconType?: IconType;
  label: string;
}

const TabButton = (props: ITabButtonProps) => {
  const { className, active, onClick, iconType, label } = props;
  return (
    <Box
      onClick={onClick}
      className={className}
      direction="row"
      border={{ side: 'bottom', color: active ? 'accent' : 'border' }}
      fill={'horizontal'}
      justify="center"
      align="center"
      gap="xsmall"
      pad={{ bottom: 'small' }}
    >
      <Icon type={iconType} themeColor={active ? 'accent' : 'secondaryText'} />
      <Text color={active ? 'accentText' : 'secondaryText'}>{label}</Text>
    </Box>
  );
};

export default TabButton;
