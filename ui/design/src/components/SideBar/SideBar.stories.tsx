import React from 'react';
import { Box, Grommet } from 'grommet';

import { MenuItemAreaType } from '@akashaproject/ui-awf-typings/lib/app-loader';

import Sidebar, { ISidebarProps } from '.';
import ViewportSizeProvider, { useViewportSize } from '../Providers/viewport-dimension';

import lightTheme from '../../styles/themes/light/light-theme';
import { installedAppsData } from '../../utils/dummy-data';

const worldApps = installedAppsData?.filter(menuItem => menuItem.area === MenuItemAreaType.AppArea);

const userInstalledApps = installedAppsData?.filter(
  menuItem => menuItem.area === MenuItemAreaType.UserAppArea,
);

const userInstalledWidgets = installedAppsData?.filter(
  menuItem => menuItem.area === MenuItemAreaType.UserWidgetArea,
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
      <Box width="25%">
        <SidebarComponent {...args} />
      </Box>
    </ViewportSizeProvider>
  </Grommet>
);

export const BaseSidebar = Template.bind({});
BaseSidebar.args = {
  worldAppsTitleLabel: 'World Apps',
  userInstalledAppsTitleLabel: 'Apps',
  userInstalledApps: userInstalledApps,
  userInstalledWidgetsTitleLabel: 'Widgets',
  userInstalledWidgets: userInstalledWidgets,
  exploreButtonLabel: 'Explore',
  allMenuItems: installedAppsData,
  bodyMenuItems: worldApps,
};
