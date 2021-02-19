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
import { text } from '@storybook/addon-knobs';

const installedAppsData: IMenuItem[] = [
  {
    label: 'AKASHA Feed',
    index: 1,
    route: '/',
    type: MenuItemType.Plugin,
    logo: { type: LogoTypeSource.ICON, value: 'appFeed' },
    area: MenuItemAreaType.AppArea,
  },
  {
    label: 'ENS',
    index: 3,
    route: '/ens-app',
    type: MenuItemType.App,
    logo: { type: LogoTypeSource.ICON, value: 'appEns' },
    subRoutes: [
      { index: 0, label: 'Edit', route: '/ens-app/edit', type: MenuItemType.Internal },
      { index: 1, label: 'Settings', route: '/ens-app/settings', type: MenuItemType.Internal },
    ],
    area: MenuItemAreaType.AppArea,
  },
  {
    label: '3box integration',
    index: 4,
    route: '/3box-app',
    type: MenuItemType.App,
    logo: { type: LogoTypeSource.ICON, value: 'app3Box' },
    subRoutes: [
      { index: 0, label: 'Edit', route: '/3box-app/edit', type: MenuItemType.Internal },
      { index: 1, label: 'Settings', route: '/3box-app/settings', type: MenuItemType.Internal },
    ],
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
    logo: { type: LogoTypeSource.ICON, value: 'searchApp' },
    area: MenuItemAreaType.SearchArea,
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
    logo: { type: LogoTypeSource.ICON, value: 'appCenter' },
    area: MenuItemAreaType.BottomArea,
  },
];

const quickAccessItems = installedAppsData?.filter(
  menuItem => menuItem.area === MenuItemAreaType.QuickAccessArea,
);
const searchAreaItem = installedAppsData?.filter(
  menuItem => menuItem.area === MenuItemAreaType.SearchArea,
)[0];
const body = installedAppsData?.filter(menuItem => menuItem.area === MenuItemAreaType.AppArea);
const footer = installedAppsData?.filter(menuItem => menuItem.area === MenuItemAreaType.BottomArea);

const { Sidebar, Topbar, ViewportSizeProvider, useViewportSize } = DS;

const TopbarComponent = () => {
  const { size } = useViewportSize();

  return (
    <Topbar
      ethAddress="0x003410490050000320006570034567114572000"
      avatarImage="https://placebeard.it/360x360"
      quickAccessItems={quickAccessItems}
      searchAreaItem={searchAreaItem}
      brandLabel={text('Brand Label', 'Ethereum.world')}
      onNavigation={(path: string) => action('Navigate to')(path)}
      onSearch={(inputValue: string) => action('Navigate to')(inputValue)}
      size={size}
      onLoginClick={() => action('OnLoginClick')('Synthetic Event')}
      onLogout={() => action('OnLogoutClick')('Synthetic Event')}
    />
  );
};

const SidebarComponent = () => {
  const { size } = useViewportSize();

  return (
    <Sidebar
      allMenuItems={installedAppsData}
      bodyMenuItems={body}
      footerMenuItems={footer}
      onClickMenuItem={() => action('Option Clicked')('Synthetic Event')}
      size={size}
    />
  );
};

storiesOf('Bars/Topbar', module).add('Topbar', () => (
  <ViewportSizeProvider>
    <TopbarComponent />
  </ViewportSizeProvider>
));

storiesOf('Bars/Sidebar', module).add('Sidebar', () => (
  <div style={{ height: '700px', border: '2px solid black', display: 'flex' }}>
    <div style={{ height: '100%', width: '14rem' }}>
      <ViewportSizeProvider>
        <SidebarComponent />
      </ViewportSizeProvider>
    </div>
    <div style={{ backgroundColor: '#EDF0F5', width: '100%', height: '100%' }} />
  </div>
));
