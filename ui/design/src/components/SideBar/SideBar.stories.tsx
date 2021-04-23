import React from 'react';
import { Grommet } from 'grommet';

import { MenuItemAreaType } from '@akashaproject/ui-awf-typings/lib/app-loader';

import { ISidebarProps, Sidebar } from '.';
import ViewportSizeProvider, { useViewportSize } from '../Providers/viewport-dimension';

import lightTheme from '../../styles/themes/light/light-theme';
import { installedAppsData } from '../../utils/dummy-data';

const body = installedAppsData?.filter(menuItem => menuItem.area === MenuItemAreaType.AppArea);
const footer = installedAppsData?.filter(menuItem => menuItem.area === MenuItemAreaType.BottomArea);

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

const Template = (args: any) => (
  <Grommet theme={lightTheme}>
    <ViewportSizeProvider>
      <SidebarComponent {...args} />
    </ViewportSizeProvider>
  </Grommet>
);

export const BaseSidebar = Template.bind({});
BaseSidebar.args = {
  allMenuItems: installedAppsData,
  bodyMenuItems: body,
  footerMenuItems: footer,
};
