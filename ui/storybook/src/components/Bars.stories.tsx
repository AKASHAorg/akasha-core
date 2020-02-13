/* eslint-disable import/first */
import DS from '@akashaproject/design-system';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { notificationsData } from './Popovers.stories';

const installedAppsData = [
  {
    name: '3Box',
    ethAddress: '0x003410490050000327496570034567114572111',
    image: 'https://pbs.twimg.com/profile_images/1125210143484985344/6Kae1Al3_400x400.png',
    options: ['Discover', 'About', 'Settings', 'Notifications'],
  },
  {
    name: 'ENS',
    ethAddress: '0x003410490050000327496570034567114572231',
    image: 'https://pbs.twimg.com/profile_images/1011937615619215360/r64kbrPi_400x400.jpg',
    options: ['Discover', 'About', 'Settings', 'Notifications'],
  },
  {
    name: '3Box',
    ethAddress: '0x003410490050000327496570034567114572111',
    image: 'https://pbs.twimg.com/profile_images/1125210143484985344/6Kae1Al3_400x400.png',
    options: ['Discover', 'About', 'Settings', 'Notifications'],
  },
  {
    name: 'ENS',
    ethAddress: '0x003410490050000327496570034567114572231',
    image: 'https://pbs.twimg.com/profile_images/1011937615619215360/r64kbrPi_400x400.jpg',
    options: ['Discover', 'About', 'Settings', 'Notifications'],
  },
  {
    name: '3Box',
    ethAddress: '0x003410490050000327496570034567114572111',
    image: 'https://pbs.twimg.com/profile_images/1125210143484985344/6Kae1Al3_400x400.png',
    options: ['Discover', 'About', 'Settings', 'Notifications'],
  },
  {
    name: 'ENS',
    ethAddress: '0x003410490050000327496570034567114572231',
    image: 'https://pbs.twimg.com/profile_images/1011937615619215360/r64kbrPi_400x400.jpg',
    options: ['Discover', 'About', 'Settings', 'Notifications'],
  },
  {
    name: '3Box',
    ethAddress: '0x003410490050000327496570034567114572111',
    image: 'https://pbs.twimg.com/profile_images/1125210143484985344/6Kae1Al3_400x400.png',
    options: ['Discover', 'About', 'Settings', 'Notifications'],
  },
  {
    name: 'ENS',
    ethAddress: '0x003410490050000327496570034567114572231',
    image: 'https://pbs.twimg.com/profile_images/1011937615619215360/r64kbrPi_400x400.jpg',
    options: ['Discover', 'About', 'Settings', 'Notifications'],
  },
  {
    name: 'GitCoin',
    ethAddress: '0x003410490050000327496570034567114572111',
    image: '',
    options: ['Discover', 'About', 'Settings', 'Notifications'],
  },
  {
    name: 'Augur',
    ethAddress: '0x003410490050000327496570034567114572231',
    image: '',
    options: ['Discover', 'About', 'Settings', 'Notifications'],
  },
];

const { Sidebar, TextIcon, Topbar, SidebarWithPopover } = DS;
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
    <div style={{ height: '450px', border: '2px solid black' }}>
      <Sidebar
        ethAddress="0x003410490050000320006570034567114572000"
        avatarImage="https://placebeard.it/360x360"
        notifications={notificationsData}
        installedApps={installedAppsData}
        onClickAddApp={action('Add App Clicked')}
        onClickOption={action('Option Clicked')}
      />
    </div>
  ))
  .add('Sidebar With Popover', () => (
    <div style={{ height: '450px', border: '2px solid black' }}>
      <SidebarWithPopover
        ethAddress="0x003410490050000320006570034567114572000"
        avatarImage="https://placebeard.it/360x360"
        notifications={notificationsData}
        installedApps={installedAppsData}
        onClickAddApp={action('Add App Clicked')}
        onClickOption={action('Option Clicked')}
      />
    </div>
  ));
