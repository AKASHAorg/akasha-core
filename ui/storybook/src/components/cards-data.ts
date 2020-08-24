import { IAppData } from '@akashaproject/design-system/lib/components/Cards/widget-cards/apps-widget-card';
import { LogoTypeSource } from '@akashaproject/ui-awf-typings';
import { chartData } from './Charts.stories';

const trendingTagsData = [
  { tagName: '#AKASHA', mentions: 176, tagHistoricData: chartData, subscribed: true },
  { tagName: '#AKASHAWorld', mentions: 94, tagHistoricData: chartData, subscribed: false },
  { tagName: '#Ethereum', mentions: 27, tagHistoricData: chartData, subscribed: false },
  { tagName: '#EthereumWorld', mentions: 17, tagHistoricData: chartData, subscribed: true },
  { tagName: '#Crypto', mentions: 6, tagHistoricData: chartData, subscribed: false },
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
  followers: '15',
  following: '1876',
  isFollowed: true,
  apps: '12',
  profileType: 'user',
  postsNumber: 235,
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
  providerName: 'ENS',
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
  content:
    'We’re back in action, energized after an epic retreat in #verbier 🇨🇭 🤜💥🤛Here’s to everyone keeping us in their minds and hearts 🥂You’ve been in our hearts and minds as well! 🤗Looking forward to sharing our insights and plans in the coming days! 🚀#AKASHAReloaded #AKASHAFoundation',
  time: '1572036522',
  replies: [
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
const appsLabel = 'Apps';
const aboutMeLabel = 'About';
const actionsLabel = 'Actions';
const usersLabel = 'Users';
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
  actionsLabel,
  appData,
  appsDataSource,
  appsLabel,
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
  usersLabel,
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
