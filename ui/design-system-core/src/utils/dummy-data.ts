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

const profileData: Profile = {
  did: { id: 'did:pkh:eip155:1:0x003410490050000320006570034567114572000', isViewer: true },
  avatar: { default: { src: 'https://placebeard.it/360x360', width: 360, height: 360 } },
  background: { default: { src: 'https://placebeard.it/540/320', height: 540, width: 320 } },
  name: 'Gilbert The Bearded',
  description:
    'Product design @companyname. Main interests: User experience, Design processes, Project Management. Author of This could be a book name, and Another Book. Love people, plants, words, and food.',
  followers: {} as FollowConnection,
  createdAt: '2023-01-01T00:00:00.000Z',
  id: '31231',
};

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

export { userData, sidebarItems, profileData, trendingTagsData };
