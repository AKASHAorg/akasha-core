import {
  IMenuItem,
  MenuItemType,
  MenuItemAreaType,
} from '@akashaproject/ui-awf-typings/lib/app-loader';
import { LogoTypeSource } from '@akashaproject/ui-awf-typings';

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

const profileData = {
  ethAddress: '0x003410490050000320006570034567114572000',
  pubKey: 'abc123',
  avatar: 'https://placebeard.it/480/480',
  coverImage: 'goldenrod',
  name: 'Gilbert The Bearded',
  userName: '@gilbert',
  ensName: 'gilbert.akasha.eth',
  description:
    'Product design @companyname. Main interests: User experience, Design processes, Project Managament. Author of This could be a book name, and Another Book. Love people, plants, words, and food.',
  totalFollowers: '15',
  totalFollowing: '1876',
  isFollowed: true,
  apps: '12',
  profileType: 'user',
  totalPosts: 235,
  default: [],
};

export { installedAppsData, profileData };
