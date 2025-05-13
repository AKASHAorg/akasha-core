import React from 'react';
import { IMenuItem } from '@akashaorg/typings/lib/ui';
import AppIcon from '@akashaorg/design-system-core/lib/components/AppIcon';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
export type MenuItemLabelProps = {
  menuItem: IMenuItem;
  isActiveMenu: boolean;
  hasNewNotifs?: boolean;
};

const MenuItemLabel: React.FC<MenuItemLabelProps> = props => {
  const { menuItem, isActiveMenu } = props;
  return (
    <Stack direction="row" alignItems="center">
      {menuItem.logo.type === 'icon' && (
        <AppIcon
          size="md"
          accentColor={true}
          stackedIcon={menuItem.label === 'Notifications'}
          placeholderIcon={menuItem.logo.value}
          solid={menuItem.logo.solidIcon}
          customStyle="bg-grey8 dark:bg-grey5"
        />
      )}

      <Typography variant="sm" bold className="ml-2.5">
        {menuItem.label}
      </Typography>
    </Stack>
  );
};
export default MenuItemLabel;
