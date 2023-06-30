import React from 'react';
import { IMenuItem } from '@akashaorg/typings/ui';
import AppIcon from '@akashaorg/design-system-core/lib/components/AppIcon';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Box from '@akashaorg/design-system-core/lib/components/Box';

export interface IMenuItemLabelProps {
  menuItem: IMenuItem;
  isActive: boolean;
  hasNewNotifs?: boolean;
  onClickMenuItem?: (menuItem: IMenuItem, isMobile?: boolean) => void;
}

const MenuItemLabel: React.FC<IMenuItemLabelProps> = props => {
  const { menuItem, isActive, onClickMenuItem } = props;

  const handleClick = () => {
    if (typeof onClickMenuItem === 'function') {
      onClickMenuItem(menuItem);
    }
  };

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
      <Text customStyle={`ml-2.5 ${isActive ? 'text-secondary' : 'text-black dark:text-white'}`}>
        {menuItem.label}
      </Text>
    </Box>
  );
};

export default MenuItemLabel;
