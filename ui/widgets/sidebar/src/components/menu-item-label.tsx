import React from 'react';

import { IMenuItem } from '@akashaorg/typings/ui';

import AppIcon from '@akashaorg/design-system-core/lib/components/AppIcon';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type MenuItemLabelProps = {
  menuItem: IMenuItem;
  hasNewNotifs?: boolean;
};

const MenuItemLabel: React.FC<MenuItemLabelProps> = props => {
  const { menuItem } = props;

  const isActive = location.pathname.includes(menuItem.name);

  return (
    <Stack align="center">
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
    </Stack>
  );
};

export default MenuItemLabel;
