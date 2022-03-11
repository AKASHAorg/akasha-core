import React from 'react';
import { Box, Grommet } from 'grommet';

import { MenuItemAreaType } from '@akashaproject/ui-awf-typings/lib/app-loader';

import Sidebar, { ISidebarProps } from '.';
import ViewportSizeProvider, { useViewportSize } from '../Providers/viewport-dimension';

import lightTheme from '../../styles/themes/light/light-theme';
import { installedAppsData } from '../../utils/dummy-data';

const worldApps = installedAppsData?.filter(menuItem => menuItem.area.includes(MenuItemAreaType.AppArea));

const userInstalledApps = installedAppsData?.filter(
  menuItem => menuItem.area.includes(MenuItemAreaType.UserAppArea)
);

const SidebarComponent = (props: ISidebarProps) => {
  const { size } = useViewportSize();

  return <Sidebar {...props} size={size} />;
};

export default {
  title: 'Bars/Sidebar',
  component: SidebarComponent,
  argTypes: {
    onClickMenuItem: { action: 'clicked menu item...' },
  },
};

const Template = (args: ISidebarProps) => (
  <Grommet theme={lightTheme}>
    <ViewportSizeProvider>
      <Box width="25%" style={{ maxHeight: '690px' }}>
        <SidebarComponent {...args} />
      </Box>
    </ViewportSizeProvider>
  </Grommet>
);

export const BaseSidebar = Template.bind({});
BaseSidebar.args = {
  worldAppsTitleLabel: 'World Apps',
  poweredByLabel: 'Powered by AKASHA',
  userInstalledAppsTitleLabel: 'Apps',
  userInstalledApps: userInstalledApps,
  exploreButtonLabel: 'Explore',
  allMenuItems: installedAppsData,
  bodyMenuItems: worldApps,
  isLoggedIn: true,
  loadingUserInstalledApps: false,
};
