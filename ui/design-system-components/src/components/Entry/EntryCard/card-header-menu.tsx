import * as React from 'react';
import { tw } from '@twind/core';
import { Menu } from '@headlessui/react';
import { IconType } from '@akashaorg/typings/lib/ui';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Button from '@akashaorg/design-system-core/lib/components/Button';

export type MenuItem = {
  label?: string;
  icon?: string;
  iconColor?: string;
  plain?: boolean;
  handler?: (arg1?: React.SyntheticEvent) => void;
  disabled?: boolean;
};

export type CardHeaderMenuProps = {
  disabled?: boolean;
  menuItems: (MenuItem | null)[];
  headerMenuExt?: React.ReactElement;
};

const CardHeaderMenuDropdown: React.FC<CardHeaderMenuProps> = props => {
  const { menuItems, disabled, headerMenuExt } = props;

  return (
    <Menu>
      <Menu.Button disabled={disabled} data-testid="entry-kebab-menu">
        <Icon type="EllipsisHorizontalIcon" accentColor={true} />
      </Menu.Button>
      <Menu.Items>
        <Stack customStyle="p-1">
          <Menu.Item>{!!headerMenuExt && React.cloneElement(headerMenuExt)}</Menu.Item>

          {menuItems.map((menuItem, idx) => {
            if (!menuItem) {
              return null;
            }
            return (
              //@TODO: refactor
              <Menu.Item key={`${menuItem.label}-${idx}`}>
                <Stack customStyle="rounded-xs p-2 hover:cursor-pointer hover:bg-secondary/30">
                  <Button
                    onClick={menuItem.handler}
                    className={tw(`flex flex-row space-x-4`)}
                    disabled={menuItem.disabled}
                    plain
                  >
                    <Text>{menuItem.label}</Text>
                    <Icon type={menuItem.icon as IconType} />
                  </Button>
                </Stack>
              </Menu.Item>
            );
          })}
        </Stack>
      </Menu.Items>
    </Menu>
  );
};

export default CardHeaderMenuDropdown;
