import React from 'react';
import { IMenuItem } from '@akashaorg/typings/lib/ui';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
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
    <Stack className="cursor-pointer">
      {subRoutes.map((subRoute, idx) => {
        const isActive =
          subRoute?.route === activeOption?.route || location.pathname.includes(subRoute?.route);
        return (
          <button
            key={subRoute.label + idx}
            onClick={e => {
              e.preventDefault();
              onOptionClick(menuItem, subRoute);
            }}
          >
            <Stack direction="row" className="hover:bg-grey8 dark:hover:bg-grey5">
              <Stack
                className={`ml-10 border-l-4 ${isActive ? 'border-secondaryLight dark:border-secondaryDark' : 'border-grey9 dark:border-grey3'}`}
              >
                <Typography className="py-4 px-8">{subRoute.label}</Typography>
              </Stack>
            </Stack>
          </button>
        );
      })}
    </Stack>
  );
};
export default MenuSubItems;
