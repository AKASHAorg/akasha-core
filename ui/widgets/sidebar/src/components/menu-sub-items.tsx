import React from 'react';

import { IMenuItem } from '@akashaorg/typings/ui';

import Text from '@akashaorg/design-system-core/lib/components/Text';
import Box from '@akashaorg/design-system-core/lib/components/Box';

export interface IMenuSubItemsProps {
  menuItem: IMenuItem;
  activeOption: IMenuItem | null;
  onOptionClick: (menu: IMenuItem, submenu: IMenuItem) => void;
}

const MenuSubItems: React.FC<IMenuSubItemsProps> = props => {
  const { menuItem, activeOption, onOptionClick } = props;

  const subRoutes = React.useMemo(() => {
    return menuItem.subRoutes.sort((a: IMenuItem, b: IMenuItem) => {
      return a.index - b.index;
    });
  }, [menuItem.subRoutes]);

  return (
    <Box customStyle="cursor-pointer">
      {subRoutes.map((subRoute, idx) => {
        const isActive =
          subRoute?.route === activeOption?.route || location.pathname.includes(subRoute?.route);

        return (
          <Box key={subRoute.label + idx} customStyle={'hover:bg-grey8 dark:hover:bg-grey5'}>
            <Box
              key={subRoute.label + idx}
              customStyle={`ml-8 border(l-4 ${
                isActive ? 'secondaryLight dark:secondaryDark' : 'grey9 dark:grey3'
              })`}
              onClick={e => {
                e.preventDefault();
                onOptionClick(menuItem, subRoute);
              }}
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
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default MenuSubItems;
