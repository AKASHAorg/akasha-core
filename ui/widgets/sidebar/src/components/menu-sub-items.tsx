import React from 'react';

import { IMenuItem } from '@akashaorg/typings/ui';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type MenuSubItemsProps = {
  menuItem: IMenuItem;
  activeOption: IMenuItem | null;
  onOptionClick: (menu: IMenuItem, submenu: IMenuItem) => void;
};

const MenuSubItems: React.FC<MenuSubItemsProps> = props => {
  const { menuItem, activeOption, onOptionClick } = props;

  const subRoutes = React.useMemo(() => {
    return menuItem.subRoutes.sort((a: IMenuItem, b: IMenuItem) => {
      return a.index - b.index;
    });
  }, [menuItem.subRoutes]);

  return (
    <Stack customStyle="cursor-pointer">
      {subRoutes.map((subRoute, idx) => {
        const isActive =
          subRoute?.route === activeOption?.route || location.pathname.includes(subRoute?.route);

        return (
          <Stack
            key={subRoute.label + idx}
            direction="row"
            customStyle={'hover:bg-grey8 dark:hover:bg-grey5'}
          >
            <button
              onClick={e => {
                e.preventDefault();
                onOptionClick(menuItem, subRoute);
              }}
            >
              <Stack
                key={subRoute.label + idx}
                customStyle={`ml-8 border(l-4 ${
                  isActive ? 'secondaryLight dark:secondaryDark' : 'grey9 dark:grey3'
                })`}
              >
                <Text
                  color={
                    isActive
                      ? { light: 'secondaryLight', dark: 'secondaryDark' }
                      : { light: 'black', dark: 'white' }
                  }
                  customStyle="py-4 px-8"
                >
                  {subRoute.label}
                </Text>
              </Stack>
            </button>
          </Stack>
        );
      })}
    </Stack>
  );
};

export default MenuSubItems;
