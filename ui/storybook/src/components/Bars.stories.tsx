/* eslint-disable import/first */
import DS from '@akashaproject/design-system';
import { IMenuItem, MenuItemType } from '@akashaproject/ui-awf-typings/lib/app-loader';
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
  },
  {
    label: 'ENS',
    index: 3,
    route: '/ens-app',
    type: MenuItemType.App,
    logo: undefined,
  },
  {
    label: '3box integration',
    index: 4,
    route: '/3box-app',
    type: MenuItemType.App,
    logo: undefined,
  },
];

const profilePluginData: IMenuItem = {
  label: 'AKASHA Profile',
  index: 2,
  route: '/profile',
  type: MenuItemType.Plugin,
  logo: undefined,
  subRoutes: [
    { index: 0, label: 'Profile list', route: '/profile/list', type: MenuItemType.Internal },
    { index: 1, label: 'My profile', route: '/profile/my-profile', type: MenuItemType.Internal },
  ],
};

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
        notifications={notificationsData}
        installedApps={installedAppsData}
        profilePluginData={profilePluginData}
        onClickAddApp={() => action('Add app Clicked')('Synthetic Event')}
        onClickMenuItem={() => action('Option Clicked')('Synthetic Event')}
        searchLabel="Search"
        appCenterLabel="App Center"
        onClickCloseSidebar={() => action('Close Sidebar Clicked')('Synthetic Event')}
        onClickSearch={() => action('Search Clicked')('Synthetic Event')}
      />
    </div>
  ))
  .add('Sidebar for Mobile', () => (
    <div style={{ height: '400px', width: '180px', border: '2px solid black' }}>
      <SidebarMobile
        loggedEthAddress="0x003410490050000320006570034567114572000"
        avatarImage="https://placebeard.it/360x360"
        notifications={notificationsData}
        installedApps={installedAppsData}
        onClickAddApp={() => action('App center Clicked')('Synthetic Event')}
        onClickMenuItem={() => action('Option Clicked')('Synthetic Event')}
        searchLabel="Search"
        appCenterLabel="App Center"
        onClickCloseSidebar={() => action('Close Sidebar Clicked')('Synthetic Event')}
        onClickSearch={() => action('Search Clicked')('Synthetic Event')}
      />
    </div>
  ));
