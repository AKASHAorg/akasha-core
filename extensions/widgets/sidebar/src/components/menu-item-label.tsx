import React from 'react';
import { IMenuItem } from '@akashaorg/typings/lib/ui';
import { IconContainer } from '@akashaorg/ui/lib/akasha-components/icon-container';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
export type MenuItemLabelProps = {
  menuItem: IMenuItem;
  isActiveMenu: boolean;
  hasNewNotifs?: boolean;
};

const MenuItemLabel: React.FC<MenuItemLabelProps> = props => {
  const { menuItem } = props;
  return (
    <Stack direction="row" alignItems="center">
      {menuItem.logo.type === 'icon' && (
        <IconContainer
          size="md"
          className={`"bg-grey8 dark:bg-grey5" ${
            menuItem.logo.solidIcon
              ? '[&_*]:fill-secondaryLight dark:[&_*]:fill-secondaryDark'
              : '[&_*]:stroke-secondaryLight dark:[&_*]:stroke-secondaryDark'
          }`}
        >
          {menuItem.logo.value}
        </IconContainer>
      )}

      <Typography variant="sm" bold className="ml-2.5">
        {menuItem.label}
      </Typography>
    </Stack>
  );
};
export default MenuItemLabel;
