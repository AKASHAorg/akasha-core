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

  const genBorderStyles = (route: string) => {
    if (route === activeOption?.route) {
      return 'border-secondaryLight dark:border-secondaryDark';
    }
    return 'border-grey9 dark:border-grey3';
  };

  return (
    <Box customStyle={'text-black dark:text-white cursor-pointer'}>
      {subRoutes.map((subRoute, idx) => (
        <Box key={subRoute.label + idx} customStyle={'hover:bg-grey8 dark:hover:bg-grey5'}>
          <Box
            key={subRoute.label + idx}
            customStyle={`ml-8 border-l-4 hover:border-transparent dark:hover:border-transparent ${genBorderStyles(
              subRoute?.route,
            )}`}
            onClick={e => {
              e.preventDefault();
              onOptionClick(menuItem, subRoute);
            }}
          >
            <Text customStyle="py-4 px-8">{subRoute.label}</Text>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default MenuSubItems;
