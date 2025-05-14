import React, { SetStateAction, useEffect, useMemo } from 'react';

import { IMenuItem } from '@akashaorg/typings/lib/ui';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@akashaorg/ui/lib/components/accordion';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';

import MenuItemLabel from './menu-item-label';
import MenuSubItems from './menu-sub-items';

export type ListSidebarAppsProps = {
  list: IMenuItem[];
  activeAccordionId: string;
  activeOption: IMenuItem;
  hasBorderTop?: boolean;
  setActiveAccordionId: React.Dispatch<SetStateAction<string>>;
  handleAccordionClick: (id: string) => void;
  onOptionClick: (menu: IMenuItem, submenu: IMenuItem) => void;
  onClickMenuItem?: (menuItem: IMenuItem, isMobile?: boolean) => void;
};

const getIsActiveMenu = (appName: string) => !!location.pathname.match(`/${appName}/`);

const ListSidebarApps: React.FC<ListSidebarAppsProps> = props => {
  const {
    list,
    activeAccordionId,
    activeOption,
    hasBorderTop = false,
    setActiveAccordionId,
    handleAccordionClick,
    onOptionClick,
    onClickMenuItem,
  } = props;

  const [appsWithSubroutes, otherApps]: IMenuItem[][] = useMemo(() => {
    return list.reduce(
      (acc, app) => {
        if (Array.isArray(app.subRoutes) && app.subRoutes.length > 0) {
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
     * checks if any of the accordion's sub menu or app's sub route
     * is currently active, and keeps same open even after refresh
     */
    appsWithSubroutes.forEach((app, idx) =>
      app.subRoutes.some(() => location.pathname.includes(`/${app.name}`))
        ? setActiveAccordionId(`${app.name}${idx}`)
        : null,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMenuItemClick = (app: IMenuItem) => () => {
    /**
     * close any open accordion,
     * then call handler
     */
    setActiveAccordionId(null);
    onClickMenuItem(app);
  };

  const borderStyle = hasBorderTop ? 'border-t-1 border-grey9 dark:border-grey3' : '';
  const activeMenuItemBg = 'bg-grey9 dark:bg-grey1';

  return (
    <Stack direction="column" className={`py-2 ${borderStyle}`}>
      {appsWithSubroutes.map((app, idx) => {
        const isActiveMenu = getIsActiveMenu(app.name);
        return (
          <Accordion
            type="single"
            collapsible
            key={app.label + idx}
            value={activeAccordionId}
            onValueChange={handleAccordionClick}
          >
            <AccordionItem value={`${app.name}${idx}`}>
              <AccordionTrigger
                className={` ${isActiveMenu ? activeMenuItemBg : ''} flex items-center py-2 px-6 rounded-none hover:bg-grey8 dark:hover:bg-grey5 hover:no-underline`}
              >
                <MenuItemLabel menuItem={app} isActiveMenu={isActiveMenu} />
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <MenuSubItems
                  menuItem={app}
                  activeOption={activeOption}
                  onOptionClick={onOptionClick}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      })}

      {otherApps.map((app, idx) => {
        const isActiveMenu = getIsActiveMenu(app.name);
        return (
          <button key={app.label + idx} onClick={handleMenuItemClick(app)}>
            <Stack
              className={`py-2 px-6 hover:bg-grey8 dark:hover:bg-grey5 ${
                isActiveMenu ? activeMenuItemBg : ''
              }`}
            >
              <MenuItemLabel menuItem={app} isActiveMenu={isActiveMenu} />
            </Stack>
          </button>
        );
      })}
    </Stack>
  );
};

export default ListSidebarApps;
