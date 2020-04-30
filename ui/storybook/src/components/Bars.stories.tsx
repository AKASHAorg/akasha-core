/* eslint-disable import/first */
import DS from '@akashaproject/design-system';
import {
  IMenuItem,
  MenuItemType,
  MenuItemAreaType,
} from '@akashaproject/ui-awf-typings/lib/app-loader';
import { LogoTypeSource } from '@akashaproject/ui-awf-typings';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { notificationsData } from './Popovers.stories';

const installedAppsData: IMenuItem[] = [
  {
    label: 'AKASHA Feed',
    index: 1,
    route: '/',
    type: MenuItemType.Plugin,
    logo: { type: LogoTypeSource.ICON, value: 'iconGeneralFeed' },
    area: MenuItemAreaType.AppArea,
  },
  {
    label: 'ENS',
    index: 3,
    route: '/ens-app',
    type: MenuItemType.App,
    logo: { type: LogoTypeSource.ICON, value: 'iconEns' },
    area: MenuItemAreaType.AppArea,
  },
  {
    label: '3box integration',
    index: 4,
    route: '/3box-app',
    type: MenuItemType.App,
    logo: { type: LogoTypeSource.ICON, value: 'icon3Box' },
    area: MenuItemAreaType.AppArea,
  },
  {
    label: 'AKASHA Profile',
    index: 2,
    route: '/profile',
    type: MenuItemType.Plugin,
    logo: { type: LogoTypeSource.AVATAR, value: '' },
    subRoutes: [
      { index: 0, label: 'Profile list', route: '/profile/list', type: MenuItemType.Internal },
      { index: 1, label: 'My profile', route: '/profile/my-profile', type: MenuItemType.Internal },
    ],
    area: MenuItemAreaType.QuickAccessArea,
  },
  {
    label: 'Search',
    index: 5,
    route: '/search',
    type: MenuItemType.Plugin,
    logo: { type: LogoTypeSource.ICON, value: 'search' },
    area: MenuItemAreaType.QuickAccessArea,
  },
  {
    label: 'Notifications',
    index: 6,
    route: '/notifications',
    type: MenuItemType.Plugin,
    logo: { type: LogoTypeSource.ICON, value: 'notifications' },
    area: MenuItemAreaType.QuickAccessArea,
  },
  {
    label: 'App Center',
    index: 7,
    route: '/appcenter',
    type: MenuItemType.Plugin,
    logo: { type: LogoTypeSource.ICON, value: 'plusDark' },
    area: MenuItemAreaType.BottomArea,
  },
];

const header = installedAppsData?.filter(
  menuItem => menuItem.area === MenuItemAreaType.QuickAccessArea,
);
const body = installedAppsData?.filter(menuItem => menuItem.area === MenuItemAreaType.AppArea);
const footer = installedAppsData?.filter(menuItem => menuItem.area === MenuItemAreaType.BottomArea);

const { Sidebar, TextIcon, Topbar, SidebarMobile } = DS;
storiesOf('Bars|Topbar', module).add('Topbar', () => (
  <Topbar
    ethAddress="0x003410490050000320006570034567114572000"
    avatarImage="https://placebeard.it/360x360"
    userName="john doe"
    brandLabel={<TextIcon iconType="ethereumWorldLogo" label="Ethereum.world" bold={true} />}
    onNavigation={(path: string) => action('Navigate to')(path)}
    notificationsData={notificationsData}
  />
));
storiesOf('Bars|Sidebar', module)
  .add('Sidebar', () => (
    <div style={{ height: '700px', border: '2px solid black' }}>
      <Sidebar
        loggedEthAddress="0x003410490050000320006570034567114572000"
        avatarImage="https://placebeard.it/360x360"
        allMenuItems={installedAppsData}
        headerMenuItems={header}
        bodyMenuItems={body}
        footerMenuItems={footer}
        onClickMenuItem={() => action('Option Clicked')('Synthetic Event')}
        searchLabel="Search"
        appCenterLabel="App Center"
        onClickCloseSidebar={() => action('Close Sidebar Clicked')('Synthetic Event')}
      />
    </div>
  ))
  .add('Sidebar for Mobile', () => (
    <div style={{ height: '400px', width: '180px', border: '2px solid black' }}>
      <SidebarMobile
        loggedEthAddress="0x003410490050000320006570034567114572000"
        avatarImage="https://placebeard.it/360x360"
        allMenuItems={installedAppsData}
        headerMenuItems={header}
        bodyMenuItems={body}
        footerMenuItems={footer}
        onClickMenuItem={() => action('Option Clicked')('Synthetic Event')}
        searchLabel="Search"
        appCenterLabel="App Center"
        onClickCloseSidebar={() => action('Close Sidebar Clicked')('Synthetic Event')}
      />
    </div>
  ));
