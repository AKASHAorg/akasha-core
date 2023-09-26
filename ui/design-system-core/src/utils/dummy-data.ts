import { AkashaFollowConnection } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { AkashaProfile } from '@akashaorg/typings/lib/ui';

const userAvatar = (width = 360, height = 360) => {
  return {
    default: { src: `https://placebeard.it/${width}x${height}`, width: width, height: height },
  };
};

const userNames = ['Alice', 'Bob', 'Charlie', 'Dave'];

const isViewer = true;

const createUser = n => {
  return {
    name: userNames[n],
    id: `41049005000032000657003456711457200${n}`,
    did: {
      id: `did:pkh:eip155:1:0x00341049005000032000657003456711457200${n}`,
      isViewer: n % 2 === 0 ? isViewer : !isViewer,
    },
    avatar: userAvatar(),
    createdAt: '2021-03-01T00:00:00.000Z',
    followers: {} as AkashaFollowConnection,
    followersCount: 0,
  };
};
const userData: AkashaProfile[] = Array.from({ length: 4 }, (v, k) => createUser(k));

const sidebarItems = [
  {
    title: 'Social Feed',
    submenu: {},
  },
  {
    title: 'Extensions',
  },
  {
    title: 'Moderation',
    submenu: {},
  },
  {
    title: 'Search',
  },
  {
    title: 'List',
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

const profileData: AkashaProfile = {
  did: { id: 'did:pkh:eip155:1:0x003410490050000320006570034567114572000', isViewer: true },
  avatar: userAvatar(),
  background: userAvatar(540, 320),
  name: 'Gilbert The Bearded',
  description:
    'Product design @companyname. Main interests: User experience, Design processes, Project Management. Author of This could be a book name, and Another Book. Love people, plants, words, and food.',
  followers: {} as AkashaFollowConnection,
  createdAt: '2023-01-01T00:00:00.000Z',
  id: '31231',
  followersCount: 12,
};

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

export { userData, sidebarItems, profileData, trendingTagsData };
