import * as React from 'react';
import { Box, Text } from 'grommet';
import Icon, { IconType } from '../Icon';
import TextIcon from '../TextIcon';
import { isMobileOnly } from 'react-device-detect';
import { StyledSelectBox } from './styled-entry-box';

export interface IMenuItemButton {
  icon?: IconType;
  label?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const MenuItemButton: React.FC<IMenuItemButton> = props => {
  const { disabled, label, icon, onClick } = props;
  if (isMobileOnly) {
    return (
      <Box
        round={{ size: 'small' }}
        border={{ color: 'border', size: 'xsmall', style: 'solid', side: 'all' }}
        onClick={onClick}
        align="center"
        pad="medium"
        fill="horizontal"
        background="background"
      >
        <Box align="center" direction="row">
          {icon && <Icon disabled={disabled} type={icon} size="md" clickable={false} />}
          <Text size="xlarge" margin={{ left: 'xsmall' }}>
            {label}
          </Text>
        </Box>
      </Box>
    );
  } else
    return (
      <StyledSelectBox>
        <TextIcon
          iconType={icon as IconType}
          label={label}
          onClick={onClick}
          iconSize="xs"
          fontSize="medium"
          disabled={disabled}
        />
      </StyledSelectBox>
    );
};

export { MenuItemButton };
