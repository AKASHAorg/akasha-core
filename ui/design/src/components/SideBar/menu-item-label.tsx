import React from 'react';
import { Box, Text } from 'grommet';

import { IMenuItem } from '@akashaproject/ui-awf-typings/lib/app-loader';

import { MenuAppButton } from './menu-app-button';

export interface IMenuItemLabelProps {
  menuItem: IMenuItem;
  isActive: boolean;
}

const MenuItemLabel: React.FC<IMenuItemLabelProps> = props => {
  const { menuItem, isActive } = props;

  return (
    <Box margin={{ vertical: 'small', left: 'medium' }} direction="row" align="center">
      <MenuAppButton menuItem={menuItem} accentColor={isActive} />
      <Text
        size="large"
        margin={{ left: 'small' }}
        color={isActive ? 'accent' : 'primaryText'}
        style={{
          width: '200px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {menuItem.label}
      </Text>
    </Box>
  );
};

export default MenuItemLabel;
