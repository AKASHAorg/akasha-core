import React from 'react';
import { tw } from '@twind/core';

import { IMenuItem } from '@akashaorg/typings/ui';

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

  return (
    <div className={tw('text-black dark:text-white cursor-pointer')}>
      {subRoutes.map((subRoute, idx) => (
        <div
          key={subRoute.label + idx}
          className={tw(
            `ml-4 border-l-4 ${
              subRoute?.route === activeOption?.route ? 'border-secondary-900' : 'border-grey9-900'
            }`,
          )}
          onClick={e => {
            e.preventDefault();
            onOptionClick(menuItem, subRoute);
          }}
        >
          <p className={tw('py-4 px-8')}>{subRoute.label}</p>
        </div>
      ))}
    </div>
  );
};

export default MenuSubItems;
