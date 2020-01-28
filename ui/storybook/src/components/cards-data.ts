import { IAppData } from '@akashaproject/design-system/lib/components/Cards/apps-widget-card';

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
  avatar: 'http://placebeard.it/480/480',
  coverImage: 'goldenrod',
  name: 'Gilbert The Bearded',
  userName: '@gilbert',
  description:
    'Product design @companyname. Main interests: User experience, Design processes, Project Managament. Author of This could be a book name, and Another Book. Love people, plants, words, and food.',
  followers: '15',
  following: '1876',
  apps: '12',
  profileType: 'user',
};

const profileProvidersData = {
  currentProviders: {
    avatar: '3Box',
    coverImage: '3Box',
    userName: 'ENS',
    name: '3Box',
    description: '3Box',
  },
  avatarProviders: [
    { providerName: '3Box', value: 'http://placebeard.it/480/480', providerIcon: '' },
    { providerName: 'ENS', value: '', providerIcon: '' },
  ],
  coverImageProviders: [
    { providerName: '3Box', value: 'goldenrod', providerIcon: '' },
    { providerName: 'ENS', value: 'red', providerIcon: '' },
  ],
  userNameProviders: [{ providerName: 'ENS', value: '@gilbert', providerIcon: '' }],
  nameProviders: [
    { providerName: '3Box', value: 'Gilbert The Bearded', providerIcon: '' },
    { providerName: 'ENS', value: 'Gilbert Bronson', providerIcon: '' },
  ],
  descriptionProviders: [
    {
      providerName: '3Box',
      providerIcon: '',
      value:
        'Product design @companyname. Main interests: User experience, Design processes, Project Managament. Author of This could be a book name, and Another Book. Love people, plants, words, and food.',
    },
    { providerName: 'ENS', providerIcon: '', value: '"Nothing at all" - Stupid Sexy Flanders' },
  ],
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

const entryData = {
  ethAddress: '0x003410490059837320006570047391024572000',
  name: 'AKASHA WORLD',
  avatar: 'http://placebeard.it/480/480',
  content:
    'We’re back in action, energized after an epic retreat in #verbier 🇨🇭 🤜💥🤛Here’s to everyone keeping us in their minds and hearts 🥂You’ve been in our hearts and minds as well! 🤗Looking forward to sharing our insights and plans in the coming days! 🚀#AKASHAReloaded #AKASHAFoundation',
  time: '1572036522',
  upvotes: 26,
  downvotes: 9,
  comments: [
    {
      ethAddress: '0x003410490050000320006570047391024572000',
      name: 'Mariana Gomes',
      avatar: 'http://placebeard.it/480/480',
      content: 'Great Job!',
      upvotes: 3,
      downvotes: 0,
      time: '1572036522',
      quotes: [],
    },
    {
      ethAddress: '0x003410490050000320006570047391024572000',
      name: 'Gigi Patratel',
      avatar: 'http://placebeard.it/480/480',
      content: 'Amazing!',
      upvotes: 2,
      downvotes: 1,
      time: '1572036522',
      quotes: [],
    },
  ],
  quotes: [
    {
      ethAddress: '0x003410490050000320006570047391024572000',
      name: 'Gigi Patratel',
      time: '1572036522',
      avatar: 'http://placebeard.it/480/480',
    },
    {
      ethAddress: '0x003410490050000320006570047391024572000',
      name: 'Gigi Patratel',
      time: '1572036522',
      avatar: 'http://placebeard.it/480/480',
    },
    {
      ethAddress: '0x003410490050000320006570047391024572000',
      name: 'Gigi Patratel',
      time: '1572036522',
      avatar: 'http://placebeard.it/480/480',
    },
    {
      ethAddress: '0x003410490050000320006570047391024572000',
      name: 'Gigi Patratel',
      time: '1572036522',
      avatar: 'http://placebeard.it/480/480',
    },
    {
      ethAddress: '0x003410490050000320006570047391024572000',
      name: 'Gigi Patratel',
      time: '1572036522',
      avatar: 'http://placebeard.it/480/480',
    },
    {
      ethAddress: '0x003410490050000320006570047391024572000',
      name: 'Gigi Patratel',
      time: '1572036522',
      avatar: 'http://placebeard.it/480/480',
    },
    {
      ethAddress: '0x003410490050000320006570047391024572000',
      name: 'Gigi Patratel',
      time: '1572036522',
      avatar: 'http://placebeard.it/480/480',
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

export {
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
};
