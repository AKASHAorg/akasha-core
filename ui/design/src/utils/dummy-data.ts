import {
  IMenuItem,
  MenuItemType,
  MenuItemAreaType,
} from '@akashaproject/ui-awf-typings/lib/app-loader';
import { LogoTypeSource, IntegrationCenterApp } from '@akashaproject/ui-awf-typings';

import { IAppData } from '../components/AppsWidgetCard';

const userData: { ethAddress: string; avatar?: string }[] = [
  {
    ethAddress: '0x003410490050000320006570034567114572000',
    avatar: 'https://placebeard.it/360x360',
  },
  {
    ethAddress: '0x004410490050000320006570034567114572001',
    avatar: 'https://placebeard.it/360x360',
  },
  {
    ethAddress: '0x005410490050000320006570034567114572002',
    avatar: 'https://placebeard.it/360x360',
  },
  {
    ethAddress: '0x006410490050000320006570034567114572003',
    avatar: 'https://placebeard.it/360x360',
  },
];

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
  pubKey: 'bbabcbaa243103inr3u2mab3wivqjjq56kiuwcejcenvwzcmjilwnirecba',
  avatar: 'https://placebeard.it/480/480',
  coverImage: 'goldenrod',
  name: 'Gilbert The Bearded',
  userName: 'gilbert',
  ensName: 'gilbert.akasha.eth',
  description:
    'Product design @companyname. Main interests: User experience, Design processes, Project Managament. Author of This could be a book name, and Another Book. Love people, plants, words, and food.',
  totalFollowers: '15',
  totalFollowing: '1876',
  isFollowed: true,
  apps: '12',
  profileType: 'user',
  totalPosts: 235,
  vnd: {},
  default: [],
  providers: [],
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

const USERNAMES = [
  {
    name: 'John',
    userName: 'john',
    pubKey: ' 13131mknnksbshl',
    avatar: 'https://placebeard.it/480/480',
    description: 'hello',
    coverImage: 'blue',
    ethAddress: '0x000001131313142834',
  },
  {
    name: 'Alex',
    userName: 'alex',
    pubKey: ' 13131mknnksbsho',
    avatar: 'https://placebeard.it/480/480',
    description: 'hello world',
    coverImage: 'red',
    ethAddress: '0x000001131313142833',
  },
  {
    name: 'Zeno',
    userName: 'zeno',
    pubKey: ' 13131mknnksbshr',
    avatar: 'https://placebeard.it/480/480',
    description: 'nono',
    coverImage: 'blue',
    ethAddress: '0x000001131313342834',
  },
];

const chartData = [
  { mentions: Math.floor(Math.random() * 100), date: 1590994625 },
  { mentions: Math.floor(Math.random() * 10), date: 1591081025 },
  { mentions: Math.floor(Math.random() * 100), date: 1591167425 },
  { mentions: Math.floor(Math.random() * 300), date: 1591253825 },
  { mentions: Math.floor(Math.random() * 280), date: 1591340225 },
  { mentions: Math.floor(Math.random() * 120), date: 1591426625 },
  { mentions: Math.floor(Math.random() * 120), date: 1591513025 },
];

const trendingTagsData = [
  { name: 'AKASHA', totalPosts: 176, tagHistoricData: chartData, subscribed: true },
  { name: 'AKASHAWorld', totalPosts: 94, tagHistoricData: chartData, subscribed: false },
  { name: 'Ethereum', totalPosts: 27, tagHistoricData: chartData, subscribed: false },
  { name: 'EthereumWorld', totalPosts: 17, tagHistoricData: chartData, subscribed: true },
  { name: 'Crypto', totalPosts: 6, tagHistoricData: chartData, subscribed: false },
];

const trendingProfilesData = [
  {
    ethAddress: '0x003410490050000320006570034567114572000',
    pubKey: 'abc123zxcv7scxkfe32fce21ce2ce2rv',
    name: 'Jon Gilbert',
    userName: '@jongilbert',
    ensName: 'jongilbert.akasha.eth',
    avatar: 'https://placebeard.it/480/480',
    coverImage: 'goldenrod',
    totalFollowers: 312,
    postsNumber: 235,
    default: [],
    providers: [],
    description:
      'Product design @companyname. Main interests: User experience, Design processes, Project Managament. Author of This could be a book name, and Another Book. Love people, plants, words, and food.',
  },
  {
    ethAddress: '0x003410490050778032325657003456711457212',
    pubKey: 'abc123zxcv7scxkfe32fce21ce2ce2rv',
    name: 'Alexei Gilbertovich',
    userName: '@alexeigilbertovich',
    ensName: 'alexeigilbertovich.akasha.eth',
    avatar: 'https://placebeard.it/480/480',
    coverImage: 'blue',
    totalFollowers: 7585,
    postsNumber: 235,
    description:
      'Product design @companyname. Main interests: User experience, Design processes, Project Managament. Author of This could be a book name, and Another Book. Love people, plants, words, and food.',
    isFollowed: true,
    default: [],
    providers: [],
  },
  {
    ethAddress: '0x003410490050000320006570034567114572000',
    pubKey: 'abc123zxcv7scxkfe32fce21ce2ce2rv',
    name: 'Jon Gilbert',
    userName: '@jongilbert',
    ensName: 'jongilbert.akasha.eth',
    avatar: 'https://placebeard.it/480/480',
    coverImage: 'goldenrod',
    totalFollowers: 312,
    postsNumber: 235,
    default: [],
    providers: [],
    description:
      'Product design @companyname. Main interests: User experience, Design processes, Project Managament. Author of This could be a book name, and Another Book. Love people, plants, words, and food.',
  },
  {
    ethAddress: '0x003410490050000320006570034567114572000',
    pubKey: 'abc123zxcv7scxkfe32fce21ce2ce2rv',
    name: 'Jon Gilbert',
    userName: '@jongilbert',
    ensName: 'jongilbert.akasha.eth',
    avatar: 'https://placebeard.it/480/480',
    coverImage: 'goldenrod',
    totalFollowers: 312,
    postsNumber: 235,
    default: [],
    providers: [],
    description:
      'Product design @companyname. Main interests: User experience, Design processes, Project Managament. Author of This could be a book name, and Another Book. Love people, plants, words, and food.',
  },
  {
    ethAddress: '0x003410490050000320006570034567114572000',
    pubKey: 'abc123zxcv7scxkfe32fce21ce2ce2rv',
    name: 'Jon Gilbert',
    userName: '@jongilbert',
    ensName: 'jongilbert.akasha.eth',
    avatar: 'https://placebeard.it/480/480',
    coverImage: 'goldenrod',
    totalFollowers: 312,
    postsNumber: 235,
    default: [],
    providers: [],
    description:
      'Product design @companyname. Main interests: User experience, Design processes, Project Managament. Author of This could be a book name, and Another Book. Love people, plants, words, and food.',
  },
];

const ICWorldAppsData: IntegrationCenterApp[] = [
  {
    name: 'Theme Wizard',
    hash: 'bbaryfskgshgirsnxnbv',
    avatar: '',
    coverImage: '',
  },
  {
    name: 'Moderating Tools',
    hash: 'bbaryfskgshgirsnxnbv',
    avatar: '',
    coverImage: '',
  },
  {
    name: 'Quick Moderation',
    hash: 'bbaryfskgshgirsnxnbv',
    avatar: '',
    coverImage: '',
  },
  {
    name: 'Confetti Replies',
    hash: 'bbaryfskgshgirsnxnbv',
    avatar: '',
    coverImage: '',
    description: `Never take a screenshot of a map again! With Mapsicle, you can quickly and seamlessly place maps in your mockups. An interactive map lets you pan to the perfect location, or you can search for a place anywhere in the world.
      Never take a screenshot of a map again! With Mapsicle, you can quickly and seamlessly place maps in your mockups. An interactive map lets you pan to the perfect location, or you can search for a place anywhere in the world.
      Never take a screenshot of a map again! With Mapsicle, you can quickly and seamlessly place maps in your mockups. An interactive map lets you pan to the perfect location, or you can search for a place anywhere in the world.
      Never take a screenshot of a map again! With Mapsicle, you can quickly and seamlessly place maps in your mockups.
      Never take a screenshot of a map again! With Mapsicle, you can quickly and seamlessly place maps in your mockups. An interactive map lets you pan to the perfect location, or you can search for a place anywhere in the world.
      Never take a screenshot of a map again!`,
    releases: [
      {
        type: 'current',
        version: '22.8.2',
        timestamp: new Date(),
      },
      {
        type: 'bug',
        version: '22.8.1',
        timestamp: new Date(),
      },
    ],
    authors: ['BoredApe', 'CyberPunk', 'TheDrFlynn'],
    tags: [
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
];

const ICInstalledAppsData: IntegrationCenterApp[] = [
  {
    name: 'Feed',
    hash: '#bbaryfskgshgirsnxnbv',
    avatar: '',
    coverImage: '',
  },
  {
    name: 'Settings',
    hash: '#bbaryfskgshgirsnxnbv',
    avatar: '',
    coverImage: '',
  },
  {
    name: 'Search',
    hash: '#bbaryfskgshgirsnxnbv',
    avatar: '',
    coverImage: '',
  },
  {
    name: 'Bookmarks',
    hash: '#bbaryfskgshgirsnxnbv',
    avatar: '',
    coverImage: '',
  },
];

const topicsDataSource = [
  { title: '#ethereumworld', subtitle: '6576 mentions' },
  { title: '#akashaworld', subtitle: '3204 mentions' },
  { title: '#cryptoworld', subtitle: '6576 mentions' },
];

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
        value: 'app3Box',
      },
    },
    coverImage: {
      providerName: '3Box',
      value: 'goldenrod',
      providerIcon: {
        type: LogoTypeSource.ICON,
        value: 'app3Box',
      },
    },
    userName: 'ENS',
    name: {
      providerName: '3Box',
      value: 'Gilbert The Bearded',
      providerIcon: {
        type: LogoTypeSource.ICON,
        value: 'app3Box',
      },
    },
    description: {
      providerName: '3Box',
      providerIcon: {
        type: LogoTypeSource.ICON,
        value: 'app3Box',
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
        value: 'app3Box',
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
        value: 'app3Box',
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
        value: 'app3Box',
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
        value: 'app3Box',
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

const boxProviderData = {
  avatar: '',
  coverImage: '',
  name: '',
  description: '',
  userName: '',
  pubKey: '',
  ethAddress: '',
};

const ensProviderData = {
  name: '',
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

const entryData = {
  entryId: '412412',
  ipfsLink: 'ipfs.io/placeholder',
  permalink: 'ethereum.world/akasha/johngilbert/412412',
  author: profileData,
  slateContent: [
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
          text: 'We’re back in action, energized after an epic retreat in ',
        },
        { value: 'verbier', type: 'tag', children: [{ text: '' }] },
        { text: ' 🇨🇭 🤜💥🤛' },
      ],
    },
    {
      type: 'paragraph',
      children: [
        {
          text: 'Here’s to everyone keeping us in their ',
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
          text: 'You’ve been in our hearts and minds as well! 🤗',
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
  ],

  time: '2011-10-05T14:48:00.000Z',
  replies: 2,
  repliesContent: [
    {
      entryId: '412413',
      ipfsLink: 'ipfs.io/placeholder',
      permalink: 'ethereum.world/akasha/marianagomes/412413',
      author: {
        ethAddress: '0x003410490050000320006570047391024572000',
        userName: '@marianagomes',
        ensName: 'marianagomes.world.eth',
        avatar: 'https://placebeard.it/480/480',
        coverImage: 'teal',
        postsNumber: 12,
      },

      content: 'Great Job!',

      time: '1572036522',
    },
    {
      entryId: '412414',
      ipfsLink: 'ipfs.io/placeholder',
      permalink: 'ethereum.world/akasha/gigipatratel/412414',
      author: {
        ethAddress: '0x003410490050000320006570047391024572000',
        userName: '@gigipatratel',
        ensName: 'gigipatratel.world.eth',
        avatar: 'https://placebeard.it/480/480',
        coverImage: 'brown',
        postsNumber: 123,
      },
      content: 'Amazing!',

      time: '1572036522',
    },
  ],
  reposts: 11,
};

const entrySocialData = {
  users: [
    {
      ethAddress: '0x003410490059837320006570047391024572000',
      userName: '@someguy',
      ensName: 'someguy.world.eth',
      avatar: 'https://placebeard.it/480/480',
    },
    {
      ethAddress: '0x003410490059837320006570047391024572111',
      userName: '@alexac',
      ensName: 'alexac.world.eth',
      avatar: 'https://placeimg.com/640/480/any',
    },
    {
      ethAddress: '0x003410490059837320006570047391024572222',
      userName: '@maochair',
      ensName: 'maochair.world.eth',
      avatar: 'https://placeimg.com/640/480/arch',
    },
    {
      ethAddress: '0x003410490059837320006570047391024572223',
      userName: '@mrnobody',
      ensName: 'mrnobody.world.eth',
      avatar: 'https://placeimg.com/640/480/nature',
    },
  ],
};

const notificationsData = [
  {
    ethAddress: '0x003410490050000320006570034567114572000',
    user: 'Mariana Gomes',
    userAvatar: 'https://placebeard.it/640/480',
    action: 'Comment',
    time: '22 July 2019 | 20h30',
  },
  {
    ethAddress: '0x003420490050000320006570034567114572000',
    user: 'Gigi Patratel',
    userAvatar: 'https://placebeard.it/640/480',
    action: 'Upvote',
    time: '22 July 2019 | 20h30',
  },
  {
    ethAddress: '0x003410490050000320006570034567114572000',
    user: 'Mariana Gomes',
    userAvatar: 'https://placebeard.it/640/480',
    action: 'Comment',
    time: '22 July 2019 | 20h30',
  },
  {
    ethAddress: '0x003420490050000320006570034567114572000',
    user: 'Gigi Patratel',
    userAvatar: 'https://placebeard.it/640/480',
    action: 'Upvote',
    time: '22 July 2019 | 20h30',
  },
  {
    ethAddress: '0x003410490050000320006570034567114572000',
    user: 'Mariana Gomes',
    userAvatar: 'https://placebeard.it/640/480',
    action: 'Comment',
    time: '22 July 2019 | 20h30',
  },
  {
    ethAddress: '0x003420490050000320006570034567114572000',
    user: 'Gigi Patratel',
    userAvatar: 'https://placebeard.it/640/480',
    action: 'Upvote',
    time: '22 July 2019 | 20h30',
  },
  {
    ethAddress: '0x003410490050000320006570034567114572000',
    user: 'Mariana Gomes',
    userAvatar: 'https://placebeard.it/640/480',
    action: 'Comment',
    time: '22 July 2019 | 20h30',
  },
  {
    ethAddress: '0x003420490050000320006570034567114572000',
    user: 'Gigi Patratel',
    userAvatar: 'https://placebeard.it/640/480',
    action: 'Upvote',
    time: '22 July 2019 | 20h30',
  },
  {
    ethAddress: '0x003410490050000320006570034567114572000',
    user: 'Mariana Gomes',
    userAvatar: 'https://placebeard.it/640/480',
    action: 'Comment',
    time: '22 July 2019 | 20h30',
  },
  {
    ethAddress: '0x003420490050000320006570034567114572000',
    user: 'Gigi Patratel',
    userAvatar: 'https://placebeard.it/640/480',
    action: 'Upvote',
    time: '22 July 2019 | 20h30',
  },
];

const changeCoverImageLabel = 'Change Cover Image';
const cancelLabel = 'Cancel';
const saveChangesLabel = 'Save Changes';
const followingLabel = 'Following';
const followersLabel = 'Followers';
const postsLabel = 'Posts';
const aboutMeLabel = 'About';
const commentsLabel = 'Comments';
const quotesLabel = 'Quotes';
const shareLabel = 'Share';
const editPostLabel = 'Edit Post';
const editCommentLabel = 'Edit Comment';
const copyLinkLabel = 'Copy Link';
const quotedByLabel = 'Quoted By';
const replyLabel = 'Reply';
const shareProfileLabel = 'Share';
const editProfileLabel = 'Edit';
const commentInputPlaceholderLabel = 'Write a comment';
const publishLabel = 'Publish';
const placeholderLabel = 'Share your thoughts';
const copyIPFSLinkLabel = 'Copy IPFS Link';
const flagAsLabel = 'Flag as inappropriate';
const bookmarkLabel = 'Save';
const bookmarkedLabel = 'Saved';
const repliesLabel = 'Replies';
const repostsLabel = 'Reposts';

export {
  userData,
  installedAppsData,
  profileData,
  TAGS,
  USERNAMES,
  appInfo,
  aboutMeLabel,
  appData,
  chartData,
  appsDataSource,
  notificationsData,
  cancelLabel,
  changeCoverImageLabel,
  commentInputPlaceholderLabel,
  commentsLabel,
  copyLinkLabel,
  editCommentLabel,
  editPostLabel,
  editProfileLabel,
  entryData,
  entrySocialData,
  followingLabel,
  followersLabel,
  postsLabel,
  profileProvidersData,
  placeholderLabel,
  publishLabel,
  quotedByLabel,
  quotesLabel,
  replyLabel,
  saveChangesLabel,
  shareLabel,
  shareProfileLabel,
  topicsDataSource,
  boxProviderData,
  ensProviderData,
  copyIPFSLinkLabel,
  flagAsLabel,
  bookmarkLabel,
  bookmarkedLabel,
  repliesLabel,
  repostsLabel,
  trendingProfilesData,
  trendingTagsData,
  ICWorldAppsData,
  ICInstalledAppsData,
};
