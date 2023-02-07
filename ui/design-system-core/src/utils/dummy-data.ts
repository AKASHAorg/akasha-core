import { UserDataType } from '../components/StackedAvatar';

const userData: UserDataType = [
  {
    ethAddress: '0x003410490050000320006570034567114572000',
    avatar: { url: 'https://placebeard.it/360x360', fallbackUrl: '' },
  },
  {
    ethAddress: '0x004410490050000320006570034567114572001',
    avatar: { url: 'https://placebeard.it/360x360', fallbackUrl: '' },
  },
  {
    ethAddress: '0x005410490050000320006570034567114572002',
    avatar: { url: 'https://placebeard.it/360x360', fallbackUrl: '' },
  },
  {
    ethAddress: '0x006410490050000320006570034567114572003',
    avatar: { url: 'https://placebeard.it/360x360', fallbackUrl: '' },
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
