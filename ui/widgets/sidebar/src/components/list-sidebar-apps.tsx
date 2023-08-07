import React, { useMemo } from 'react';

import { IMenuItem } from '@akashaorg/typings/ui';

import Accordion from '@akashaorg/design-system-core/lib/components/Accordion';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

import MenuItemLabel from './menu-item-label';
import MenuSubItems from './menu-sub-items';

export type ListSidebarAppsProps = {
  list: IMenuItem[];
  activeOption: IMenuItem;
  hasBorderTop?: boolean;
  onOptionClick: (menu: IMenuItem, submenu: IMenuItem) => void;
  onClickMenuItem?: (menuItem: IMenuItem, isMobile?: boolean) => () => void;
};

const ListSidebarApps: React.FC<ListSidebarAppsProps> = props => {
  const { list, activeOption, hasBorderTop = false, onOptionClick, onClickMenuItem } = props;

  const borderStyle = hasBorderTop ? 'border(t-1 grey8)' : '';

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

  return (
    <Stack direction="column" customStyle={`py-2 ${borderStyle}`}>
      {appsWithSubroutes.map((app, idx) => (
        <Accordion
          key={app.label + idx}
          customStyle="py-2 px-6 bg(hover:grey8 dark:hover:grey5)"
          titleNode={<MenuItemLabel menuItem={app} />}
          contentNode={
            <MenuSubItems
              menuItem={app}
              activeOption={activeOption}
              onOptionClick={onOptionClick}
            />
          }
        />
      ))}

      {otherApps.map((app, idx) => (
        <Box
          key={app.label + idx}
          customStyle="py-2 px-6 bg(hover:grey8 dark:hover:grey5) cursor-pointer"
          onClick={onClickMenuItem(app)}
        >
          <MenuItemLabel menuItem={app} />
        </Box>
      ))}
    </Stack>
  );
};

export default ListSidebarApps;
