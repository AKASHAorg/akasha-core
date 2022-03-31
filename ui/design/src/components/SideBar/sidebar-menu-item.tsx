import * as React from 'react';
import { IMenuItem } from '@akashaproject/ui-awf-typings/lib/app-loader';

import MenuItemLabel from './menu-item-label';
import MenuSubItems from './menu-sub-items';

import { DesktopAccordionPanel, MobileAccordionPanel } from './styled-sidebar';

interface SidebarMenuItemProps {
  currentRoute?: string;
  size: string;
  index: number;
  menuItem: IMenuItem;
  onMenuItemClick: (menuItem: IMenuItem, shouldCloseSidebar: boolean) => void;
  onSubMenuItemClick: (
    menuItem: IMenuItem,
    subMenuItem: IMenuItem,
    shouldCloseSidebar?: boolean,
  ) => void;
  activeOption: IMenuItem;
  hasNewNotifs?: boolean;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = props => {
  const { currentRoute, menuItem, size, index, activeOption, hasNewNotifs } = props;

  const activePanel = !!currentRoute?.match(menuItem?.route);

  const handleAppIconClick = (shouldCloseSidebar?: boolean) => () => {
    props.onMenuItemClick(menuItem, shouldCloseSidebar);
  };

  const handleSubrouteClick = (
    menuItem: IMenuItem,
    subMenuItem: IMenuItem,
    shouldCloseSidebar?: boolean,
  ) => {
    props.onSubMenuItemClick(menuItem, subMenuItem, shouldCloseSidebar);
  };

  return (
    <>
      <DesktopAccordionPanel
        size={size}
        key={`${index}-${menuItem.label}`}
        hasChevron={menuItem.subRoutes?.length > 0}
        onClick={handleAppIconClick()}
        isActive={activePanel}
        label={
          <MenuItemLabel menuItem={menuItem} isActive={activePanel} hasNewNotifs={hasNewNotifs} />
        }
      >
        {menuItem.subRoutes && menuItem.subRoutes.length > 0 && (
          <MenuSubItems
            isMobile={false}
            menuItem={menuItem}
            activeOption={activeOption}
            onOptionClick={handleSubrouteClick}
          />
        )}
      </DesktopAccordionPanel>
      <MobileAccordionPanel
        size={size}
        key={`${index}-mobile-${menuItem.label}`}
        hasChevron={menuItem.subRoutes?.length > 0}
        onClick={handleAppIconClick(true)}
        isActive={activePanel}
        label={
          <MenuItemLabel menuItem={menuItem} isActive={activePanel} hasNewNotifs={hasNewNotifs} />
        }
      >
        {menuItem.subRoutes && menuItem.subRoutes.length > 0 && (
          <MenuSubItems
            isMobile={true}
            menuItem={menuItem}
            activeOption={activeOption}
            onOptionClick={(menu, subMenu) => handleSubrouteClick(menu, subMenu, true)}
          />
        )}
      </MobileAccordionPanel>
    </>
  );
};

SidebarMenuItem.displayName = 'SidebarMenuItem';
export default SidebarMenuItem;
