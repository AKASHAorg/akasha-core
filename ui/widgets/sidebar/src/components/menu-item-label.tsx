import React from 'react';
import { tw } from '@twind/core';

import DS from '@akashaorg/design-system-core';
import { IMenuItem } from '@akashaorg/typings/ui';
import { IconType } from '@akashaorg/design-system-core/lib/components/Icon';

const { AppIcon, Text } = DS;

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
    <div
      className={tw('flex flex-row items-center')}
      onClick={e => {
        e.preventDefault();
        handleClick();
      }}
    >
      <div
        className={tw(
          'w-10 h-10 flex items-center justify-center rounded-full bg-grey9 dark:bg-grey3',
        )}
      >
        <AppIcon
          size="md"
          plain={true}
          stackedIcon={menuItem.logo.value === 'notifications'}
          placeholderIconType={menuItem.logo.value as IconType}
        />
      </div>
      <Text
        variant="body1"
        className={`ml-2.5 ${isActive ? 'text-secondary' : 'text-black dark:text-white'}`}
      >
        {menuItem.label}
      </Text>
    </div>
  );
};

export default MenuItemLabel;
