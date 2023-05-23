import { FollowConnection, Profile } from '@akashaorg/typings/sdk/graphql-types-new';

const userData: Profile[] = [
  {
    name: 'Alice',
    id: '410490050000320006570034567114572000',
    did: { id: 'did:pkh:eip155:1:0x003410490050000320006570034567114572000', isViewer: true },
    avatar: { default: { src: 'https://placebeard.it/360x360', width: 360, height: 360 } },
    createdAt: '2021-03-01T00:00:00.000Z',
    followers: {} as FollowConnection,
  },
  {
    name: 'Bob',
    id: '410490050000320006570034567114572001',
    did: { id: 'did:pkh:eip155:1:0x004410490050000320006570034567114572001', isViewer: false },
    avatar: { default: { src: 'https://placebeard.it/360x360', width: 360, height: 360 } },
    createdAt: '2020-03-01T00:00:00.000Z',
    followers: {} as FollowConnection,
  },
  {
    name: 'Charlie',
    id: '410490050000320006570034567114572002',
    did: { id: 'did:pkh:eip155:1:0x005410490050000320006570034567114572002', isViewer: true },
    avatar: { default: { src: 'https://placebeard.it/360x360', width: 360, height: 360 } },
    createdAt: '2023-03-01T00:00:00.000Z',
    followers: {} as FollowConnection,
  },
  {
    name: 'Dave',
    id: '410490050000320006570034567114572003',
    did: { id: 'did:pkh:eip155:1:0x006410490050000320006570034567114572003', isViewer: false },
    avatar: { default: { src: 'https://placebeard.it/360x360', width: 360, height: 360 } },
    createdAt: '2022-03-01T00:00:00.000Z',
    followers: {} as FollowConnection,
  },
];

const sidebarItems = [
  {
    title: 'Social Feed',
    submenu: {},
  },
  {
    title: 'Integration Center',
  },
  {
    title: 'Moderation',
    submenu: {},
  },
  {
    title: 'Search',
  },
  {
    title: 'Bookmarks',
  },
  {
    title: 'Notifications',
  },
  {
    title: 'Settings',
  },
  {
    title: 'Legal',
    submenu: {},
  },
];

export { userData, sidebarItems };
