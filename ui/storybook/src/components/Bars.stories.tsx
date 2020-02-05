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
  },
  {
    name: 'ENS',
    ethAddress: '0x003410490050000327496570034567114572231',
    image: 'https://pbs.twimg.com/profile_images/1011937615619215360/r64kbrPi_400x400.jpg',
  },
  {
    name: '3Box',
    ethAddress: '0x003410490050000327496570034567114572111',
    image: 'https://pbs.twimg.com/profile_images/1125210143484985344/6Kae1Al3_400x400.png',
  },
  {
    name: 'ENS',
    ethAddress: '0x003410490050000327496570034567114572231',
    image: 'https://pbs.twimg.com/profile_images/1011937615619215360/r64kbrPi_400x400.jpg',
  },
  {
    name: '3Box',
    ethAddress: '0x003410490050000327496570034567114572111',
    image: 'https://pbs.twimg.com/profile_images/1125210143484985344/6Kae1Al3_400x400.png',
  },
  {
    name: 'ENS',
    ethAddress: '0x003410490050000327496570034567114572231',
    image: 'https://pbs.twimg.com/profile_images/1011937615619215360/r64kbrPi_400x400.jpg',
  },
  {
    name: '3Box',
    ethAddress: '0x003410490050000327496570034567114572111',
    image: 'https://pbs.twimg.com/profile_images/1125210143484985344/6Kae1Al3_400x400.png',
  },
  {
    name: 'ENS',
    ethAddress: '0x003410490050000327496570034567114572231',
    image: 'https://pbs.twimg.com/profile_images/1011937615619215360/r64kbrPi_400x400.jpg',
  },
  {
    name: 'GitCoin',
    ethAddress: '0x003410490050000327496570034567114572111',
    image: '',
  },
  {
    name: 'Augur',
    ethAddress: '0x003410490050000327496570034567114572231',
    image: '',
  },
];

const { Sidebar, TextIcon, Topbar } = DS;
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
storiesOf('Bars|Sidebar', module).add('Sidebar', () => (
  <div style={{ height: '450px' }}>
    <Sidebar
      aboutLabel="About"
      feedLabel="Feed"
      collectionsLabel="Collections"
      ethAddress="0x003410490050000320006570034567114572000"
      avatarImage="https://placebeard.it/360x360"
      notifications={notificationsData}
      installedApps={installedAppsData}
    />
  </div>
));
