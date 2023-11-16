import React, { useEffect, useMemo } from 'react';

import { IMenuItem } from '@akashaorg/typings/lib/ui';
import { useAccordion } from '@akashaorg/ui-awf-hooks';

import Accordion from '@akashaorg/design-system-core/lib/components/Accordion';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

import MenuItemLabel from './menu-item-label';
import MenuSubItems from './menu-sub-items';

export type ListSidebarAppsProps = {
  list: IMenuItem[];
  activeOption: IMenuItem;
  hasBorderTop?: boolean;
  onOptionClick: (menu: IMenuItem, submenu: IMenuItem) => void;
  onClickMenuItem?: (menuItem: IMenuItem, isMobile?: boolean) => void;
};

const ListSidebarApps: React.FC<ListSidebarAppsProps> = props => {
  const { list, activeOption, hasBorderTop = false, onOptionClick, onClickMenuItem } = props;

  const { active, setActive, handleAccordionClick } = useAccordion();

  const [appsWithSubroutes, otherApps]: IMenuItem[][] = useMemo(() => {
    return list.reduce(
      (acc, app) => {
        if (app.subRoutes.length > 0) {
          acc[0].push(app);
        } else {
          acc[1].push(app);
        }
        return acc;
      },
      [[], []],
    );
  }, [list]);

  useEffect(() => {
    /**
     * checks if any of the accordion's sub menu is
     * currently active, and keeps same open even after refresh
     */
    appsWithSubroutes.forEach((app, idx) =>
      app.subRoutes.some(r => location.pathname === `/${app.name}${r.route}`)
        ? setActive(idx)
        : null,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMenuItemClick = (app: IMenuItem) => () => {
    /**
     * close any open accordion,
     * then call handler
     */
    setActive(null);
    onClickMenuItem(app);
  };

  const borderStyle = hasBorderTop ? 'border(t-1 grey8)' : '';
  const activeMenuItemBg = 'bg(grey8 dark:grey5)';

  return (
    <Stack direction="column" customStyle={`py-2 ${borderStyle}`}>
      {appsWithSubroutes.map((app, idx) => (
        <Accordion
          key={app.label + idx}
          accordionId={idx}
          open={idx === active}
          titleNode={<MenuItemLabel menuItem={app} />}
          contentNode={
            <MenuSubItems
              menuItem={app}
              activeOption={activeOption}
              onOptionClick={onOptionClick}
            />
          }
          handleClick={handleAccordionClick}
          customStyle={`py-2 px-6 bg(hover:grey8 dark:hover:grey5) ${
            location.pathname.includes(app.name) ? activeMenuItemBg : ''
          }`}
        />
      ))}

      {otherApps.map((app, idx) => (
        <button key={app.label + idx} onClick={handleMenuItemClick(app)}>
          <Stack
            padding="py-2 px-6"
            customStyle={`bg(hover:grey8 dark:hover:grey5)  ${
              location.pathname.includes(app.name) ? activeMenuItemBg : ''
            }`}
          >
            <MenuItemLabel menuItem={app} />
          </Stack>
        </button>
      ))}
    </Stack>
  );
};

export default ListSidebarApps;
