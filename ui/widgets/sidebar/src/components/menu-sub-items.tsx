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

  return (
    <div className={tw('text-black dark:text-white cursor-pointer')}>
      {subRoutes.map((subRoute, idx) => (
        <div
          key={subRoute.label + idx}
          className={tw(
            `ml-4 border-l-4 ${
              subRoute?.route === activeOption?.route
                ? 'border-secondary-light dark:border-secondary-dark'
                : 'border-grey9 dark:border-grey3'
            }`,
          )}
          onClick={e => {
            e.preventDefault();
            onOptionClick(menuItem, subRoute);
          }}
        >
          <Text variant="body1" className="py-4 px-8">
            {subRoute.label}
          </Text>
        </div>
      ))}
    </div>
  );
};

export default MenuSubItems;
