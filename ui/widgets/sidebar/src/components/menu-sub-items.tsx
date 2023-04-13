import React from 'react';
import { tw } from '@twind/core';

import { IMenuItem } from '@akashaorg/typings/ui';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export interface IMenuSubItemsProps {
  menuItem: IMenuItem;
  activeOption: IMenuItem | null;
  onOptionClick: (menu: IMenuItem, submenu: IMenuItem) => void;
}

const MenuSubItems: React.FC<IMenuSubItemsProps> = props => {
  const { menuItem, activeOption, onOptionClick } = props;

  const subRoutes = menuItem.subRoutes.sort((a: IMenuItem, b: IMenuItem) => {
    return a.index - b.index;
  });

  const genBorderStyles = (route: string) =>
    route === activeOption?.route
      ? 'border-secondaryLight dark:border-secondaryDark'
      : 'border-grey9 dark:border-grey3';

  return (
    <div className={tw('text-black dark:text-white cursor-pointer')}>
      {subRoutes.map((subRoute, idx) => (
        <div key={subRoute.label + idx} className={tw('hover:bg-grey8 dark:hover:bg-grey5')}>
          <div
            key={subRoute.label + idx}
            className={tw(
              `ml-8 border-l-4 hover:border-transparent dark:hover:border-transparent ${genBorderStyles(
                subRoute?.route,
              )}`,
            )}
            onClick={e => {
              e.preventDefault();
              onOptionClick(menuItem, subRoute);
            }}
          >
            <Text customStyle="py-4 px-8">{subRoute.label}</Text>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuSubItems;
