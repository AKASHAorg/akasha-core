import { Descendant } from 'slate';
import { LogoTypeSource } from '@akashaorg/typings/ui';
import { ReleaseInfo } from '@akashaorg/typings/sdk';
import { IMenuItem, MenuItemType, MenuItemAreaType, IChatMessage } from '@akashaorg/typings/ui';
import { IAppData } from '../components/AppsWidgetCard';
import { IntegrationInfo, IntegrationReleaseInfo } from '@akashaorg/typings/sdk/graphql-types';
import { Profile } from '@akashaorg/typings/ui';

const createUser = n => {
  return {
    did: { id: `did:0x00341049005000032000657003456711457200${n}` },
    avatar: { default: { src: 'https://placebeard.it/360x360', height: 360, width: 360 } },
  };
};
const userData: { did: Profile['did']; avatar?: Profile['avatar'] }[] = Array.from(
  { length: 4 },
  (v, k) => createUser(k),
);

const installedAppsData: IMenuItem[] = [
  {
    label: 'Feed',
    index: 1,
    route: '/social-app/feed',
    type: MenuItemType.App,
    logo: { type: LogoTypeSource.ICON, value: 'appSocial' },
    subRoutes: [
      {
        index: 0,
        label: 'My Feed',
        route: '/social-app/feed/?filter=personal',
        type: MenuItemType.Internal,
      },
      { index: 1, label: 'General', route: '/social-app/feed', type: MenuItemType.Internal },
    ],
    area: [MenuItemAreaType.AppArea],
  },
  {
    label: 'Moderating',
    index: 3,
    route: '/moderation-app',
    type: MenuItemType.App,
    logo: { type: LogoTypeSource.ICON, value: 'appModeration' },
    area: [MenuItemAreaType.AppArea],
  },
  {
    label: 'Integration Center',
    index: 4,
    route: '/integration-app',
    type: MenuItemType.App,
    logo: { type: LogoTypeSource.ICON, value: 'appCenter' },
    area: [MenuItemAreaType.AppArea],
  },
  {
    label: 'Search',
    index: 8,
    route: '/social-app/search',
    type: MenuItemType.App,
    logo: { type: LogoTypeSource.ICON, value: 'search' },
    area: [MenuItemAreaType.AppArea],
  },
  {
    label: 'Notification',
    index: 9,
    route: '/social-app/notifications',
    type: MenuItemType.App,
    logo: { type: LogoTypeSource.ICON, value: 'notifications' },
    area: [MenuItemAreaType.AppArea],
  },
  {
    label: 'List',
    index: 10,
    route: '/social-app/bookmarks',
    type: MenuItemType.App,
    logo: { type: LogoTypeSource.ICON, value: 'bookmark' },
    area: [MenuItemAreaType.AppArea],
  },
  {
    label: 'Baker Swap',
    index: 11,
    route: '/apps/baker-swap',
    type: MenuItemType.App,
    logo: { type: LogoTypeSource.String, value: undefined },
    subRoutes: [
      { index: 0, label: 'Trade', route: '/apps/baker-swap/trade', type: MenuItemType.Internal },
      {
        index: 1,
        label: 'Market Place',
        route: '/apps/baker-swap/home',
        type: MenuItemType.Internal,
      },
      {
        index: 2,
        label: 'Featured Artist',
        route: '/apps/baker-swap/featured?filter=artists',
        type: MenuItemType.Internal,
      },
      { index: 3, label: 'Assets', route: '/apps/baker-swap/assets', type: MenuItemType.Internal },
    ],
    area: [MenuItemAreaType.UserAppArea],
  },
  {
    label: 'Image Editor',
    index: 12,
    route: '/apps/image-editor',
    type: MenuItemType.App,
    logo: { type: LogoTypeSource.String, value: undefined },
    area: [MenuItemAreaType.UserAppArea],
  },
  {
    label: 'Appreciation',
    index: 13,
    route: '/apps/appreciation',
    type: MenuItemType.App,
    logo: { type: LogoTypeSource.String, value: 'https://placebeard.it/360x360' },
    area: [MenuItemAreaType.UserAppArea],
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
    area: [MenuItemAreaType.QuickAccessArea],
  },
  {
    label: 'Search',
    index: 5,
    route: '/search',
    type: MenuItemType.Plugin,
    logo: { type: LogoTypeSource.ICON, value: 'search' },
    area: [MenuItemAreaType.SearchArea],
    subRoutes: [],
  },
  {
    label: 'Notifications',
    index: 6,
    route: '/notifications',
    type: MenuItemType.Plugin,
    logo: { type: LogoTypeSource.ICON, value: 'notifications' },
    area: [MenuItemAreaType.QuickAccessArea],
    subRoutes: [],
  },
  {
    label: 'App Center',
    index: 7,
    route: '/appcenter',
    type: MenuItemType.Plugin,
    logo: { type: LogoTypeSource.ICON, value: 'appCenter' },
    area: [MenuItemAreaType.BottomArea],
    subRoutes: [],
  },
];

const profileData: Profile = {
  id: '14572000',
  did: { id: 'bbabcbaa243103inr3u2mab3wivqjjq56kiuwcejcenvwzcmjilwnirecba' },
  avatar: { default: { src: 'https://placebeard.it/480/480', height: 480, width: 480 } },
  background: { default: { src: 'https://placebeard.it/540/320', height: 540, width: 320 } },
  name: 'Gilbert The Bearded',
  description:
    'Product design @companyname. Main interests: User experience, Design processes, Project Management. Author of This could be a book name, and Another Book. Love people, plants, words, and food.',
  createdAt: '2020-01-01T00:00:00.000Z',
};

const TAGS = [
  'ethereum',
  'bitcoin',
  'cryptocurrency',
  'blockchain',
  'crypto',
  'btc',
  'litecoin',
  'bitcoinmining',
  'eth',
  'money',
  'trading',
  'bitcoins',
  'bitcoinnews',
  'forex',
  'cryptocurrencies',
  'investment',
  'ripple',
  'cryptonews',
  'bitcoincash',
  'xrp',
  'cryptotrading',
  'coinbase',
  'bitcointrading',
  'bitcoinprice',
  'business',
  'investing',
  'binance',
  'invest',
  'entrepreneur',
  'bhfyp',
];

const nameList = [
  'Jon Gilbert',
  'Alexei Gilbertovich',
  'Jon Silbert',
  'Jon Wilbert',
  'Jon Bilbert',
];
const didList = [
  '13131mknnksbshr',
  '13131mknnksbsho',
  '13131mknnksbshl',
  '14232mknnksbskr',
  '13131mknnksbskr',
];
const descriptionList = [
  'nono',
  'hello world',
  'hello',
  'Product design @companyname. Main interests: User experience, Design processes, Project Managament. Author of This could be a book name, and Another Book. Love people, plants, words, and food.',
];

const USERNAMES = Array.from({ length: 3 }, (k, v) => {
  return {
    id: (v + 1).toString(),
    name: nameList[v],
    did: { id: didList[v] },
    avatar: { default: { src: 'https://placebeard.it/480/480', height: 480, width: 480 } },
    description: descriptionList[v],
    background: { default: { src: 'https://placebeard.it/540/320', height: 540, width: 320 } },
    createdAt: '2020-01-01',
  };
});

const randomMentions = n => {
  return { mentions: Math.floor(Math.random() * n), date: 1590994625 };
};
const chartData = Array.from({ length: 7 }, (k, v) => {
  return randomMentions(Math.floor(Math.random() * 300 + 10));
});

const trendingTagsData = [
  { name: 'AKASHA', totalPosts: 176, tagHistoricData: chartData, subscribed: true },
  { name: 'AKASHAWorld', totalPosts: 94, tagHistoricData: chartData, subscribed: false },
  { name: 'Ethereum', totalPosts: 27, tagHistoricData: chartData, subscribed: false },
  { name: 'EthereumWorld', totalPosts: 17, tagHistoricData: chartData, subscribed: true },
  { name: 'Crypto', totalPosts: 6, tagHistoricData: chartData, subscribed: false },
];

const trendingProfilesData: Profile[] = Array.from({ length: 4 }, (k, v) => {
  return {
    id: (123 + v).toString(),
    name: nameList[v],
    did: { id: didList[v] },
    avatar: { default: { src: 'https://placebeard.it/480/480', height: 480, width: 480 } },
    description: descriptionList[3],
    background: { default: { src: 'https://placebeard.it/540/320', height: 540, width: 320 } },
    createdAt: '2020-01-01',
  };
});

const ICDetailAppsData: (IntegrationInfo & Partial<{ releases: ReleaseInfo[] }>)[] = [
  {
    name: 'Theme Wizard',
    id: 'bbaryfskgshgirsnxnbv',
    author: '@akasha',
    integrationType: 1,
    latestReleaseId: '0xf9427384932',
    enabled: true,
  },
  {
    name: 'Moderating Tools',
    id: 'bbaryfskgshgirsnxnbv',
    author: '@akasha',
    integrationType: 1,
    latestReleaseId: '0xf4427384982',
    enabled: true,
  },
  {
    name: 'Quick Moderation',
    id: 'bbaryfskgshgirsnxnbv',
    author: '@akasha',
    integrationType: 1,
    latestReleaseId: '0xf9427384986',
    enabled: true,
  },
  {
    name: 'Confetti Replies',
    id: 'bbaryfskgshgirsnxnbv',
    author: '@akasha',
    integrationType: 1,
    latestReleaseId: '0xf9427384382',
    enabled: true,

    releases: [
      {
        integrationID: 'bbaryfskgshgirsnxnbv',
        id: '0x428974897274',
        version: '0.1.0',
        author: '0x0402384032858094',
        enabled: true,
        name: 'Confetti Replies',
        integrationType: 1,
        sources: ['bdabsdbasb'],
        manifestData: {
          mainFile: 'index.js',
          displayName: 'Confetti',
          keywords: [
            'Image editor',
            'Photo Filters',
            'Filters',
            'Photos',
            'Pro',
            'Color editing',
            'Confetti',
            'Visuals',
          ],
          license: 'wtfpl',
        },
      },
    ],
  },
];

const installedAppNameList = [
  { name: 'Theme Wizard', displayName: 'Theme Wiz', keyword: ['theme'] },
  { name: 'Moderating Tools', displayName: 'Mod Tools', keyword: ['moderation'] },
  { name: 'Quick Moderation', displayName: 'Quik Mod', keyword: ['moderation'] },
  { name: 'Confetti Replies', displayName: 'Confetti Replies', keyword: ['replies'] },
];

const ICInstalledAppsData: IntegrationReleaseInfo[] = Array.from({ length: 4 }, (k, v) => {
  return {
    name: installedAppNameList[v].name,
    id: 'bbaryfskgshgirsnxnbv',
    author: '@akasha',
    integrationType: 1,
    integrationID: '3182731927391',
    version: '0.1.0',
    manifestData: {
      mainFile: 'index.js',
      displayName: installedAppNameList[v].displayName,
      keywords: installedAppNameList[v].keyword,
      license: 'wtfpl',
    },
    enabled: true,
  };
});

const worldAppsList = [
  { name: 'Feed', displayName: 'Feed', keyword: ['feed'], integrationID: '3182731927321' },
  {
    name: 'Settings',
    displayName: 'Settings',
    keyword: ['settings'],
    integrationID: '3182731927124',
  },
  {
    name: 'Search',
    displayName: 'Search',
    keyword: ['search'],
    integrationID: '3182731927392',
  },
  {
    name: 'List',
    displayName: 'List',
    keyword: ['saving', 'bookmarks'],
    integrationID: '3182731927396',
  },
];
const ICWorldAppsData: IntegrationReleaseInfo[] = Array.from({ length: 4 }, (k, v) => {
  return {
    name: worldAppsList[v].name,
    id: '#bbaryfskgshgirsnxnbv',
    author: '@akasha',
    integrationType: 1,
    integrationID: worldAppsList[v].integrationID,
    version: '0.1.0',
    manifestData: {
      mainFile: 'index.js',
      displayName: worldAppsList[v].displayName,
      keywords: worldAppsList[v].keyword,
      license: 'wtfpl',
    },
    enabled: true,
  };
});

// const topicsDataSource = [
//   { title: '#ethereumworld', subtitle: '6576 mentions' },
//   { title: '#akashaworld', subtitle: '3204 mentions' },
//   { title: '#cryptoworld', subtitle: '6576 mentions' },
// ];

const appsDataSource: IAppData[] = [
  { title: 'GitCoin', subtitle: '123 embedded cards', appIconType: 'app', iconSize: '40px' },
  { title: 'Augur', subtitle: '89 embedded cards', appIconType: 'app', iconSize: '40px' },
  { title: 'Aragon', subtitle: '57 embedded cards', appIconType: 'app', iconSize: '40px' },
];

const profileProvidersData = {
  currentProviders: {
    avatar: {
      providerName: '3Box',
      value: 'https://placebeard.it/480/480',
      providerIcon: {
        type: LogoTypeSource.ICON,
        value: 'appAkasha',
      },
    },
    coverImage: {
      providerName: '3Box',
      value: 'goldenrod',
      providerIcon: {
        type: LogoTypeSource.ICON,
        value: 'appAkasha',
      },
    },
    userName: 'ENS',
    name: {
      providerName: '3Box',
      value: 'Gilbert The Bearded',
      providerIcon: {
        type: LogoTypeSource.ICON,
        value: 'appAkasha',
      },
    },
    description: {
      providerName: '3Box',
      providerIcon: {
        type: LogoTypeSource.ICON,
        value: 'appAkasha',
      },
      value:
        'Product design @companyname. Main interests: User experience, Design processes, Project Managament. Author of This could be a book name, and Another Book. Love people, plants, words, and food.',
    },
  },
  avatarProviders: [
    {
      providerName: '3Box',
      value: 'https://placebeard.it/480/480',
      providerIcon: {
        type: LogoTypeSource.ICON,
        value: 'appAkasha',
      },
    },
    {
      providerName: 'ENS',
      value: '',
      providerIcon: {
        type: LogoTypeSource.ICON,
        value: 'appEns',
      },
    },
  ],
  coverImageProviders: [
    {
      providerName: '3Box',
      value: 'goldenrod',
      providerIcon: {
        type: LogoTypeSource.ICON,
        value: 'appAkasha',
      },
    },
    {
      providerName: 'ENS',
      value: 'red',
      providerIcon: {
        type: LogoTypeSource.ICON,
        value: 'appEns',
      },
    },
  ],
  nameProviders: [
    {
      providerName: '3Box',
      value: 'Gilbert The Bearded',
      providerIcon: {
        type: LogoTypeSource.ICON,
        value: 'appAkasha',
      },
    },
    {
      providerName: 'ENS',
      value: 'Gilbert Bronson',
      providerIcon: {
        type: LogoTypeSource.ICON,
        value: 'appEns',
      },
    },
  ],
  descriptionProviders: [
    {
      providerName: '3Box',
      providerIcon: {
        type: LogoTypeSource.ICON,
        value: 'appAkasha',
      },
      value:
        'Product design @companyname. Main interests: User experience, Design processes, Project Managament. Author of This could be a book name, and Another Book. Love people, plants, words, and food.',
    },
    {
      providerName: 'ENS',
      providerIcon: {
        type: LogoTypeSource.ICON,
        value: 'appEns',
      },
      value: '"Nothing at all" - Stupid Sexy Flanders',
    },
  ],
};

const boxProviderData: Profile = {
  id: '123',
  avatar: { default: { src: '', width: 0, height: 0 } },
  background: { default: { src: '', width: 0, height: 0 } },
  name: '',
  description: '',
  did: { id: '' },

  createdAt: '',
};

const appData = {
  ethAddress: '0x003410490050000320006570047391021232334',
  avatarImage: '',
  coverImage: '#CAF2F9;',
  name: 'Aragon',
  userName: '@aragonorg',
  description:
    'Aragon is a project to empower freedom by creating tools for decentralized organizations to thrive. We believe the fate of humanity will be decided at the frontier of technological innovation.',
  users: '21896',
  actions: '12',
  profileType: 'dapp',
};

const appInfo = {
  name: '3Box',
  version: '0.1.2',
  status: 'Live',
  lastUpdateDate: '1578671422',
  registryDate: '1563810622',
  admin: '@anadoe',
  category: 'Development',
};

const slateContent = [
  {
    type: 'paragraph',
    children: [
      {
        text: 'Hello ',
      },
      {
        name: 'Arnulfo Madrain',
        userName: '@arnulfo',
        pubKey: '4m1242mb42m4b',
        avatar: '',
        ethAddress: '0x03131',
        type: 'mention',
        children: [{ text: '' }],
      },
      { text: ' how is ' },
      { value: 'ethereum', type: 'tag', children: [{ text: '' }] },
      { text: ' working out for you?' },
    ],
  },
  {
    children: [{ text: '' }],
    type: 'image',
    url: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIyM3B4IiB2aWV3Qm94PSIwIDAgMTYgMjMiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogc2tldGNodG9vbCA1OS4xICgxMDEwMTApIC0gaHR0cHM6Ly9za2V0Y2guY29tIC0tPgogICAgPHRpdGxlPjAxN0RDRjM1LTI5RjUtNDQxNS1BOENDLTJBMkUxMzM3MDA4ODwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggc2tldGNodG9vbC48L2Rlc2M+CiAgICA8ZGVmcz4KICAgICAgICA8cG9seWdvbiBpZD0icGF0aC0xIiBwb2ludHM9IjAgMC4wMDIwMzM2MzEyNiA3LjYzMiA0LjE1NDI1ODU1IDcuNjMyIDkuOTQ1NiI+PC9wb2x5Z29uPgogICAgICAgIDxwb2x5Z29uIGlkPSJwYXRoLTMiIHBvaW50cz0iMCAwLjAwMjAzMzYzMTI2IDcuNjMyIDQuMTU0MjU4NTUgNy42MzIgOS45NDU2Ij48L3BvbHlnb24+CiAgICAgICAgPHBvbHlnb24gaWQ9InBhdGgtNSIgcG9pbnRzPSIwLjAxNDQgMCAwLjAxNDQgMTUuOTE0NTg2NCA3LjcxODQgMTEuNzY2NTQyMSI+PC9wb2x5Z29uPgogICAgICAgIDxwb2x5Z29uIGlkPSJwYXRoLTciIHBvaW50cz0iMC4wMTQ0IDAgMC4wMTQ0IDE1LjkxNDU4NjQgNy43MTg0IDExLjc2NjU0MjEiPjwvcG9seWdvbj4KICAgIDwvZGVmcz4KICAgIDxnIGlkPSJGbG93LSMxLeKAlC1SZWd1bGFyLVBvc3QtIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iUmVndWxhci1Qb3N0LUZsb3ct4oCULTMuNi1MaW5rLUltYWdlLVBvcG92ZXIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yOC4wMDAwMDAsIC0yNS4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9IkhvbWUiPgogICAgICAgICAgICAgICAgPGcgaWQ9IlRvcGJhciI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9IldvcmxkLU5hbWUiPgogICAgICAgICAgICAgICAgICAgICAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNC4wMDAwMDAsIDI1LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPGcgaWQ9ImV0aGVyZXVtLndvcmxkLWxvZ28iPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxnIGlkPSJMb2dvIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGcgaWQ9ImV0aGVyZXVtLndvcmxkLWxvZ28iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQuMDAwMDAwLCAwLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGcgaWQ9ImFrYXNoYS1oZXJvQDN4IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjA4NjQwMCwgMTMuMDk0NDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG1hc2sgaWQ9Im1hc2stMiIgZmlsbD0id2hpdGUiPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dXNlIHhsaW5rOmhyZWY9IiNwYXRoLTEiPjwvdXNlPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbWFzaz4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dXNlIGlkPSJNYXNrIiBmaWxsPSIjNkU2RUZBIiB4bGluazpocmVmPSIjcGF0aC0xIj48L3VzZT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxnIGlkPSJha2FzaGEtaGVyb0AzeCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTEuNTEwNDAwLCAxOC4zNzQ0MDApIHNjYWxlKC0xLCAxKSB0cmFuc2xhdGUoLTExLjUxMDQwMCwgLTE4LjM3NDQwMCkgdHJhbnNsYXRlKDcuNjcwNDAwLCAxMy4wOTQ0MDApIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bWFzayBpZD0ibWFzay00IiBmaWxsPSJ3aGl0ZSI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj0iI3BhdGgtMyI+PC91c2U+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9tYXNrPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1c2UgaWQ9Ik1hc2siIGZpbGw9IiMyOTI2RDciIHhsaW5rOmhyZWY9IiNwYXRoLTMiPjwvdXNlPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGcgaWQ9ImFrYXNoYS1oZXJvQDN4Ij4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bWFzayBpZD0ibWFzay02IiBmaWxsPSJ3aGl0ZSI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj0iI3BhdGgtNSI+PC91c2U+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9tYXNrPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1c2UgaWQ9Ik1hc2siIGZpbGw9IiNFRThDOEEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMuODY2NDAwLCA3Ljk1NzI5Mykgc2NhbGUoLTEsIDEpIHRyYW5zbGF0ZSgtMy44NjY0MDAsIC03Ljk1NzI5MykgIiB4bGluazpocmVmPSIjcGF0aC01Ij48L3VzZT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxnIGlkPSJha2FzaGEtaGVyb0AzeCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTEuMTE2ODAwLCA4LjE2MDAwMCkgc2NhbGUoLTEsIDEpIHRyYW5zbGF0ZSgtMTEuMTE2ODAwLCAtOC4xNjAwMDApIHRyYW5zbGF0ZSg2Ljc5NjgwMCwgMC4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bWFzayBpZD0ibWFzay04IiBmaWxsPSJ3aGl0ZSI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj0iI3BhdGgtNyI+PC91c2U+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9tYXNrPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1c2UgaWQ9Ik1hc2siIGZpbGw9IiM0MTM1NTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMuODY2NDAwLCA3Ljk1NzI5Mykgc2NhbGUoLTEsIDEpIHRyYW5zbGF0ZSgtMy44NjY0MDAsIC03Ljk1NzI5MykgIiB4bGluazpocmVmPSIjcGF0aC03Ij48L3VzZT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+',
  },
  {
    type: 'paragraph',
    children: [
      {
        text: "We're back in action, energized after an epic retreat in ",
      },
      { value: 'verbier', type: 'tag', children: [{ text: '' }] },
      { text: ' 🇨🇭 🤜💥🤛' },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: "Here's to everyone keeping us in their ",
      },
      { text: 'minds', bold: true },
      { text: ' and ' },
      { text: 'hearts', bold: true },
      { text: ' 🥂' },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: "You've been in our hearts and minds as well! 🤗",
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: 'Looking forward to sharing our insights and plans in the coming days! 🚀 ',
      },
      { value: 'AKASHAReloaded', type: 'tag', children: [{ text: '' }] },
      { text: ' ' },
      { value: 'AKASHAFoundation', type: 'tag', children: [{ text: '' }] },
    ],
  },
];

const replyEntries = [
  {
    userName: '@marianagomes',
    ensName: 'marianagomes.world.eth',
    content: 'Great Job!',
  },
  {
    userName: '@gigipatratel',
    ensName: 'gigipatratel.world.eth',
    content: 'Amazing!',
  },
];

const replyContent = Array.from({ length: 2 }, (k, v) => {
  return {
    entryId: (412413 + v).toString(),
    ipfsLink: 'ipfs.io/placeholder',
    permalink: `ethereum.world/akasha/marianagomes/${412413 + v}`,
    author: {
      ethAddress: '0x003410490050000320006570047391024572000',
      userName: replyEntries[v].userName,
      ensName: replyEntries[v].ensName,
      avatar: {
        url: 'https://placebeard.it/480/480',
        fallbackUrl: 'https://placebeard.it/480/480',
      },
      coverImage: { url: 'teal', fallbackUrl: 'teal' },
      totalPosts: '12',
      _id: '3123123',
      totalFollowers: 15,
      totalFollowing: 1876 + v,
      totalInterests: 3,
    },

    content: replyEntries[v].content,

    time: '1572036522',
  };
});

const entryData = {
  entryId: '412412',
  ipfsLink: 'ipfs.io/placeholder',
  permalink: 'ethereum.world/akasha/johngilbert/412412',
  author: profileData,
  slateContent: slateContent as Descendant[],
  time: '2011-10-05T14:48:00.000Z',
  replies: 2,
  repliesContent: replyContent,
  reposts: 11,
};

// const entrySocialData = {
//   users: [
//     {
//       ethAddress: '0x003410490059837320006570047391024572000',
//       userName: '@someguy',
//       ensName: 'someguy.world.eth',
//       avatar: { fallbackUrl: 'https://placebeard.it/480/480' },
//     },
//     {
//       ethAddress: '0x003410490059837320006570047391024572111',
//       userName: '@alexac',
//       ensName: 'alexac.world.eth',
//       avatar: { fallbackUrl: 'https://placeimg.com/640/480/any' },
//     },
//     {
//       ethAddress: '0x003410490059837320006570047391024572222',
//       userName: '@maochair',
//       ensName: 'maochair.world.eth',
//       avatar: { fallbackUrl: 'https://placeimg.com/640/480/arch' },
//     },
//     {
//       ethAddress: '0x003410490059837320006570047391024572223',
//       userName: '@mrnobody',
//       ensName: 'mrnobody.world.eth',
//       avatar: { fallbackUrl: 'https://placeimg.com/640/480/nature' },
//     },
//   ],
// };

const userAvatar = () => {
  return { default: { src: 'https://placebeard.it/640/480', width: 640, height: 480 } };
};

const notificationsData = Array(5)
  .fill([
    {
      profileId: '0x003410490050000320006570034567114572000',
      user: 'Mariana Gomes',
      userAvatar: userAvatar(),
      action: 'Comment',
      time: '22 July 2019 | 20h30',
    },
    {
      profileId: '0x003420490050000320006570034567114572000',
      user: 'Gigi Patratel',
      userAvatar: userAvatar(),
      action: 'Upvote',
      time: '22 July 2019 | 20h30',
    },
  ])
  .flat();

const changeCoverImageLabel = 'Change Cover Image';
const cancelLabel = 'Cancel';
const saveChangesLabel = 'Save Changes';
const followingLabel = 'Following';
const followersLabel = 'Followers';
const postsLabel = 'Posts';
const aboutMeLabel = 'About';
const badgesLabel = 'Badges';
// const commentsLabel = 'Comments';
// const quotesLabel = 'Quotes';
const shareLabel = 'Share';
// const editPostLabel = 'Edit Post';
// const editCommentLabel = 'Edit Comment';
const copyLinkLabel = 'Copy Link';
// const quotedByLabel = 'Quoted By';
const replyLabel = 'Reply';
const shareProfileLabel = 'Share';
const editProfileLabel = 'Edit';
// const commentInputPlaceholderLabel = 'Write a comment';
const publishLabel = 'Publish';
const placeholderLabel = 'Share your thoughts';
// const copyIPFSLinkLabel = 'Copy IPFS Link';
const flagAsLabel = 'Flag as inappropriate';
const bookmarkLabel = 'Save';
const bookmarkedLabel = 'Saved';
const repliesLabel = 'Replies';

const dummyChatArr: IChatMessage[] = [
  {
    name: 'Jerry Mil',
    id: '6',
    avatar: userAvatar(),
    background: userAvatar(),
    did: { id: '0x003410490050000320006570034567114572000' },

    createdAt: '2021-06-22T10:07:15.000Z',
    read: true,
    content: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Hello ',
          },
          {
            name: 'Estelle Collier',
            userName: '@estellecollier',
            pubKey: 'bbabcbaa243103inr3u2mab3wivqjjq56kiuwcejcenvwzcmjilwnirecba',
            avatar: '',
            ethAddress: '0x003410490050000320006570034567114572021',
            type: 'mention',
            children: [{ text: '' }],
          },
          {
            text: ' how are you? I really like the article you shared about NFTs, do you have any experience in NFTs?',
          },
        ],
      },
    ] as Descendant[],
    timestamp: '2022-06-22T10:07:15.000Z',
  },
  {
    name: 'Estelle Collier',
    id: '5',
    avatar: userAvatar(),
    background: userAvatar(),
    did: { id: '0x003410490050000320006570034567114572021' },

    createdAt: '2021-06-22T10:07:15.000Z',
    read: true,
    content: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'You mean this one: ',
          },
          {
            value: 'https://www.bankless.community/get-in-on-nfts-decentralized-arts-8',
            type: 'tag',
            children: [{ text: '' }],
          },
        ],
      },
    ] as Descendant[],
    timestamp: '2022-06-22T10:08:03.000Z',
  },
  {
    name: 'Jerry Mil',
    id: '1',
    avatar: userAvatar(),
    background: userAvatar(),
    did: { id: '0x003410490050000320006570034567114572001' },

    createdAt: '2021-06-22T10:07:15.000Z',
    content: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Yeap, that one. I will check it out',
          },
        ],
      },
    ],
    timestamp: '2022-06-22T10:08:19.000Z',
  },
  {
    name: 'Jerry Mil',
    id: '2',
    avatar: userAvatar(),
    background: userAvatar(),
    did: { id: '0x003410490050000320006570034567114572002' },

    createdAt: '2021-06-22T10:07:15.000Z',
    read: true,
    content: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Thanks a lot 🙌',
          },
        ],
      },
    ],
    timestamp: '2022-06-22T10:08:26.000Z',
  },
  {
    name: 'Estelle Collier',
    id: '3',
    avatar: userAvatar(),
    background: userAvatar(),
    did: { id: '0x003410490050000320006570034567114572003' },

    createdAt: '2021-06-22T10:07:15.000Z',
    read: true,
    content: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Awesome. No worries',
          },
        ],
      },
    ],
    timestamp: '2022-06-22T10:09:26.000Z',
  },
  {
    name: 'Jerry Mil',
    id: '4',
    avatar: userAvatar(),
    background: userAvatar(),
    did: { id: '0x003410490050000320006570034567114572006' },

    createdAt: '2021-06-22T10:07:15.000Z',
    read: false,
    content: [
      {
        type: 'paragraph',
        children: [
          {
            text: '🍻',
          },
        ],
      },
    ],
    timestamp: '2022-06-22T10:10:06.000Z',
  },
];

const sampleDevKey = {
  addedAt: '2022-10-05T22:01:34.889Z',
  name: 'Sample Key',
  pubKey: 'bbaareigw7ua7k3thuacm2qpuhkgxone3ynsfo6n2v6pwgzpq2ie3eu7lpi',
};

export {
  userData,
  installedAppsData,
  profileData,
  TAGS,
  USERNAMES,
  appInfo,
  aboutMeLabel,
  badgesLabel,
  appData,
  chartData,
  appsDataSource,
  notificationsData,
  cancelLabel,
  changeCoverImageLabel,
  // commentInputPlaceholderLabel,
  // commentsLabel,
  copyLinkLabel,
  // editCommentLabel,
  // editPostLabel,
  editProfileLabel,
  entryData,
  // entrySocialData,
  followingLabel,
  followersLabel,
  postsLabel,
  profileProvidersData,
  placeholderLabel,
  publishLabel,
  // quotedByLabel,
  // quotesLabel,
  replyLabel,
  saveChangesLabel,
  shareLabel,
  shareProfileLabel,
  // topicsDataSource,
  boxProviderData,
  // copyIPFSLinkLabel,
  flagAsLabel,
  bookmarkLabel,
  bookmarkedLabel,
  repliesLabel,
  trendingProfilesData,
  trendingTagsData,
  ICWorldAppsData,
  ICInstalledAppsData,
  ICDetailAppsData,
  dummyChatArr,
  sampleDevKey,
};
