import React from 'react';
import { Box, Text } from 'grommet';

import { IMenuItem } from '@akashaorg/ui-awf-typings/lib/app-loader';

import { MenuAppButton } from './menu-app-button';

export interface IMenuItemLabelProps {
  menuItem: IMenuItem;
  isActive: boolean;
  hasNewNotifs?: boolean;
}

const MenuItemLabel: React.FC<IMenuItemLabelProps> = props => {
  const { menuItem, isActive, hasNewNotifs } = props;

  return (
    <Box margin={{ vertical: 'small', left: 'medium' }} direction="row" align="center">
      <MenuAppButton menuItem={menuItem} accentColor={isActive} hasNewNotifs={hasNewNotifs} />
      <Text
        size="large"
        margin={{ left: 'small' }}
        color={isActive ? 'accentText' : 'primaryText'}
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
