import React from 'react';
import { apply, tw } from '@twind/core';

import { IMenuItem } from '@akashaorg/typings/ui';
import Accordion from '@akashaorg/design-system-core/lib/components/Accordion';

import MenuItemLabel from './menu-item-label';
import MenuSubItems from './menu-sub-items';

export interface IListSidebarAppsProps {
  list: IMenuItem[];
  activeOption: IMenuItem;
  hasBorderTop?: boolean;
  onOptionClick: (menu: IMenuItem, submenu: IMenuItem) => void;
  onClickMenuItem?: (menuItem: IMenuItem, isMobile?: boolean) => void;
}

const ListSidebarApps: React.FC<IListSidebarAppsProps> = props => {
  const { list, activeOption, hasBorderTop = false, onOptionClick, onClickMenuItem } = props;

  return (
    <div className={tw(apply`flex flex-col py-2 ${hasBorderTop ? 'border-t-1 border-grey8' : ''}`)}>
      {list?.map((app, idx) => (
        <React.Fragment key={app.label + idx}>
          {app.subRoutes.length > 0 ? (
            <Accordion
              style="py-2 px-6 hover:bg-grey8 dark:hover:bg-grey5"
              titleNode={<MenuItemLabel menuItem={app} isActive={false} />}
              contentNode={
                <MenuSubItems
                  menuItem={app}
                  activeOption={activeOption}
                  onOptionClick={onOptionClick}
                />
              }
            />
          ) : (
            <div
              key={app.label + idx}
              className={tw(apply('px-4 hover:bg-grey8 dark:hover:bg-grey5'))}
            >
              <div className={tw(apply('p-2 cursor-pointer'))}>
                <MenuItemLabel menuItem={app} isActive={false} onClickMenuItem={onClickMenuItem} />
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ListSidebarApps;
