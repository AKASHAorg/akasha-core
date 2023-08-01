import React from 'react';

import { IMenuItem } from '@akashaorg/typings/ui';

import AppIcon from '@akashaorg/design-system-core/lib/components/AppIcon';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export interface IMenuItemLabelProps {
  menuItem: IMenuItem;
  hasNewNotifs?: boolean;
  onClickMenuItem?: (menuItem: IMenuItem, isMobile?: boolean) => void;
}

const MenuItemLabel: React.FC<IMenuItemLabelProps> = props => {
  const { menuItem, onClickMenuItem } = props;

  const handleClick = () => {
    if (typeof onClickMenuItem === 'function') {
      onClickMenuItem(menuItem);
    }
  };

  const isActive = location.pathname.includes(menuItem.name);

  return (
    <Box customStyle={'flex flex-row items-center'} onClick={handleClick}>
      <Box customStyle="w-10 h-10 flex items-center justify-center rounded-full bg-grey9 dark:bg-grey3">
        {menuItem.logo.type === 'icon' && (
          <AppIcon
            size="md"
            stackedIcon={menuItem.logo.value === 'notifications'}
            placeholderIconType={menuItem.logo.value}
          />
        )}
      </Box>

      <Text
        variant="button-md"
        color={
          isActive
            ? { light: 'secondaryLight', dark: 'secondaryDark' }
            : { light: 'black', dark: 'white' }
        }
        customStyle={`ml-2.5 ${isActive ? 'text-secondary' : 'text(black dark:white)'}`}
      >
        {menuItem.label}
      </Text>
    </Box>
  );
};

export default MenuItemLabel;
