import { IAppData } from '@akashaproject/design-system/lib/components/Cards/widget-cards/apps-widget-card';
import { LogoTypeSource } from '@akashaproject/ui-awf-typings';
import { chartData } from './Charts.stories';

const trendingTagsData = [
  { name: '#AKASHA', totalPosts: 176, tagHistoricData: chartData, subscribed: true },
  { name: '#AKASHAWorld', totalPosts: 94, tagHistoricData: chartData, subscribed: false },
  { name: '#Ethereum', totalPosts: 27, tagHistoricData: chartData, subscribed: false },
  { name: '#EthereumWorld', totalPosts: 17, tagHistoricData: chartData, subscribed: true },
  { name: '#Crypto', totalPosts: 6, tagHistoricData: chartData, subscribed: false },
];

const trendingProfilesData = [
  {
    ethAddress: '0x003410490050000320006570034567114572000',
    name: 'Jon Gilbert',
    userName: '@jongilbert',
    ensName: 'jongilbert.akasha.eth',
    avatar: 'https://placebeard.it/480/480',
    coverImage: 'goldenrod',
    followers: 312,
    postsNumber: 235,
    description:
      'Product design @companyname. Main interests: User experience, Design processes, Project Managament. Author of This could be a book name, and Another Book. Love people, plants, words, and food.',
  },
  {
    ethAddress: '0x003410490050778032325657003456711457212',
    name: 'Alexei Gilbertovich',
    userName: '@alexeigilbertovich',
    ensName: 'alexeigilbertovich.akasha.eth',
    coverImage: 'blue',
    followers: 7585,
    postsNumber: 235,
    description:
      'Product design @companyname. Main interests: User experience, Design processes, Project Managament. Author of This could be a book name, and Another Book. Love people, plants, words, and food.',
    isFollowed: true,
  },
  {
    ethAddress: '0x003410490050000320006570034567114572000',
    name: 'Jon Gilbert',
    userName: '@jongilbert',
    ensName: 'jongilbert.akasha.eth',
    avatar: 'https://placebeard.it/480/480',
    coverImage: 'goldenrod',
    followers: 312,
    postsNumber: 235,
    description:
      'Product design @companyname. Main interests: User experience, Design processes, Project Managament. Author of This could be a book name, and Another Book. Love people, plants, words, and food.',
  },
  {
    ethAddress: '0x003410490050000320006570034567114572000',
    name: 'Jon Gilbert',
    userName: '@jongilbert',
    ensName: 'jongilbert.akasha.eth',
    avatar: 'https://placebeard.it/480/480',
    coverImage: 'goldenrod',
    followers: 312,
    postsNumber: 235,
    description:
      'Product design @companyname. Main interests: User experience, Design processes, Project Managament. Author of This could be a book name, and Another Book. Love people, plants, words, and food.',
  },
  {
    ethAddress: '0x003410490050000320006570034567114572000',
    name: 'Jon Gilbert',
    userName: '@jongilbert',
    ensName: 'jongilbert.akasha.eth',
    avatar: 'https://placebeard.it/480/480',
    coverImage: 'goldenrod',
    followers: 312,
    postsNumber: 235,
    description:
      'Product design @companyname. Main interests: User experience, Design processes, Project Managament. Author of This could be a book name, and Another Book. Love people, plants, words, and food.',
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

const profileData = {
  ethAddress: '0x003410490050000320006570034567114572000',
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
};

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
  providerName: '3Box',
  avatar: undefined,
  coverImage: undefined,
  name: '',
  description: '',
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
  content: [
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
      url:
        'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIyM3B4IiB2aWV3Qm94PSIwIDAgMTYgMjMiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogc2tldGNodG9vbCA1OS4xICgxMDEwMTApIC0gaHR0cHM6Ly9za2V0Y2guY29tIC0tPgogICAgPHRpdGxlPjAxN0RDRjM1LTI5RjUtNDQxNS1BOENDLTJBMkUxMzM3MDA4ODwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggc2tldGNodG9vbC48L2Rlc2M+CiAgICA8ZGVmcz4KICAgICAgICA8cG9seWdvbiBpZD0icGF0aC0xIiBwb2ludHM9IjAgMC4wMDIwMzM2MzEyNiA3LjYzMiA0LjE1NDI1ODU1IDcuNjMyIDkuOTQ1NiI+PC9wb2x5Z29uPgogICAgICAgIDxwb2x5Z29uIGlkPSJwYXRoLTMiIHBvaW50cz0iMCAwLjAwMjAzMzYzMTI2IDcuNjMyIDQuMTU0MjU4NTUgNy42MzIgOS45NDU2Ij48L3BvbHlnb24+CiAgICAgICAgPHBvbHlnb24gaWQ9InBhdGgtNSIgcG9pbnRzPSIwLjAxNDQgMCAwLjAxNDQgMTUuOTE0NTg2NCA3LjcxODQgMTEuNzY2NTQyMSI+PC9wb2x5Z29uPgogICAgICAgIDxwb2x5Z29uIGlkPSJwYXRoLTciIHBvaW50cz0iMC4wMTQ0IDAgMC4wMTQ0IDE1LjkxNDU4NjQgNy43MTg0IDExLjc2NjU0MjEiPjwvcG9seWdvbj4KICAgIDwvZGVmcz4KICAgIDxnIGlkPSJGbG93LSMxLeKAlC1SZWd1bGFyLVBvc3QtIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iUmVndWxhci1Qb3N0LUZsb3ct4oCULTMuNi1MaW5rLUltYWdlLVBvcG92ZXIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yOC4wMDAwMDAsIC0yNS4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9IkhvbWUiPgogICAgICAgICAgICAgICAgPGcgaWQ9IlRvcGJhciI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9IldvcmxkLU5hbWUiPgogICAgICAgICAgICAgICAgICAgICAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNC4wMDAwMDAsIDI1LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPGcgaWQ9ImV0aGVyZXVtLndvcmxkLWxvZ28iPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxnIGlkPSJMb2dvIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGcgaWQ9ImV0aGVyZXVtLndvcmxkLWxvZ28iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQuMDAwMDAwLCAwLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGcgaWQ9ImFrYXNoYS1oZXJvQDN4IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjA4NjQwMCwgMTMuMDk0NDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG1hc2sgaWQ9Im1hc2stMiIgZmlsbD0id2hpdGUiPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dXNlIHhsaW5rOmhyZWY9IiNwYXRoLTEiPjwvdXNlPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbWFzaz4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dXNlIGlkPSJNYXNrIiBmaWxsPSIjNkU2RUZBIiB4bGluazpocmVmPSIjcGF0aC0xIj48L3VzZT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxnIGlkPSJha2FzaGEtaGVyb0AzeCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTEuNTEwNDAwLCAxOC4zNzQ0MDApIHNjYWxlKC0xLCAxKSB0cmFuc2xhdGUoLTExLjUxMDQwMCwgLTE4LjM3NDQwMCkgdHJhbnNsYXRlKDcuNjcwNDAwLCAxMy4wOTQ0MDApIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bWFzayBpZD0ibWFzay00IiBmaWxsPSJ3aGl0ZSI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj0iI3BhdGgtMyI+PC91c2U+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9tYXNrPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1c2UgaWQ9Ik1hc2siIGZpbGw9IiMyOTI2RDciIHhsaW5rOmhyZWY9IiNwYXRoLTMiPjwvdXNlPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGcgaWQ9ImFrYXNoYS1oZXJvQDN4Ij4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bWFzayBpZD0ibWFzay02IiBmaWxsPSJ3aGl0ZSI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj0iI3BhdGgtNSI+PC91c2U+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9tYXNrPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1c2UgaWQ9Ik1hc2siIGZpbGw9IiNFRThDOEEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMuODY2NDAwLCA3Ljk1NzI5Mykgc2NhbGUoLTEsIDEpIHRyYW5zbGF0ZSgtMy44NjY0MDAsIC03Ljk1NzI5MykgIiB4bGluazpocmVmPSIjcGF0aC01Ij48L3VzZT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxnIGlkPSJha2FzaGEtaGVyb0AzeCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTEuMTE2ODAwLCA4LjE2MDAwMCkgc2NhbGUoLTEsIDEpIHRyYW5zbGF0ZSgtMTEuMTE2ODAwLCAtOC4xNjAwMDApIHRyYW5zbGF0ZSg2Ljc5NjgwMCwgMC4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bWFzayBpZD0ibWFzay04IiBmaWxsPSJ3aGl0ZSI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj0iI3BhdGgtNyI+PC91c2U+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9tYXNrPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1c2UgaWQ9Ik1hc2siIGZpbGw9IiM0MTM1NTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMuODY2NDAwLCA3Ljk1NzI5Mykgc2NhbGUoLTEsIDEpIHRyYW5zbGF0ZSgtMy44NjY0MDAsIC03Ljk1NzI5MykgIiB4bGluazpocmVmPSIjcGF0aC03Ij48L3VzZT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+',
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

  time: '1572036522',
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
  appInfo,
  aboutMeLabel,
  appData,
  appsDataSource,
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
  profileData,
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
};
