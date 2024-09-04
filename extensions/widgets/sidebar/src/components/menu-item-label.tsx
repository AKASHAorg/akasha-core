import React from 'react';

import { IMenuItem } from '@akashaorg/typings/lib/ui';

import AppIcon from '@akashaorg/design-system-core/lib/components/AppIcon';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type MenuItemLabelProps = {
  menuItem: IMenuItem;
  isActiveMenu: boolean;
  hasNewNotifs?: boolean;
};

const MenuItemLabel: React.FC<MenuItemLabelProps> = props => {
  const { menuItem, isActiveMenu } = props;

  return (
    <Stack direction="row" align="center">
      <Stack
        align="center"
        justify="center"
        customStyle="w-10 h-10 rounded-full bg-grey9 dark:bg-grey3"
      >
        {menuItem.logo.type === 'icon' && (
          <AppIcon
            size="md"
            accentColor={true}
            stackedIcon={menuItem.label === 'Notifications'}
            placeholderIcon={menuItem.logo.value}
            solid={menuItem.logo.solidIcon}
          />
        )}
      </Stack>

      <Text
        variant="button-md"
        color={
          isActiveMenu
            ? { light: 'secondaryLight', dark: 'secondaryDark' }
            : { light: 'black', dark: 'white' }
        }
        customStyle="ml-2.5"
      >
        {menuItem.label}
      </Text>
    </Stack>
  );
};

export default MenuItemLabel;
