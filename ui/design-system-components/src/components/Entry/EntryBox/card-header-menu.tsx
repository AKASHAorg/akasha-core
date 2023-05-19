import * as React from 'react';
import { tw } from '@twind/core';
import { Menu } from '@headlessui/react';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { IconType } from '@akashaorg/typings/ui';

export interface IMenuItem {
  label?: string;
  icon?: string;
  iconColor?: string;
  plain?: boolean;
  handler?: (arg1?: React.SyntheticEvent) => void;
  disabled?: boolean;
}

export interface ICardHeaderMenuProps {
  disabled?: boolean;
  menuItems: (IMenuItem | null)[];
  headerMenuExt?: React.ReactElement;
}

const CardHeaderMenuDropdown: React.FC<ICardHeaderMenuProps> = props => {
  const { menuItems, disabled } = props;

  return (
    <Menu>
      <Menu.Button disabled={disabled} data-testid="entry-kebab-menu">
        <Icon type="EllipsisHorizontalIcon" accentColor={true} />
      </Menu.Button>
      <Menu.Items>
        <div className={tw(`p-1`)}>
          <Menu.Item>{!!props.headerMenuExt && React.cloneElement(props.headerMenuExt)}</Menu.Item>

          {menuItems.map((menuItem, idx) => {
            if (!menuItem) {
              return null;
            }
            return (
              <Menu.Item key={`${menuItem.label}-${idx}`}>
                <div className={tw(`rounded-xs p-2 hover:cursor-pointer hover:bg-secondary/30`)}>
                  <button
                    onClick={menuItem.handler}
                    className={tw(`flex flex-row space-x-4`)}
                    disabled={menuItem.disabled}
                  >
                    <Text>{menuItem.label}</Text>
                    <Icon type={menuItem.icon as IconType} />
                  </button>
                </div>
              </Menu.Item>
            );
          })}
        </div>
      </Menu.Items>
    </Menu>
  );
};

export default CardHeaderMenuDropdown;
