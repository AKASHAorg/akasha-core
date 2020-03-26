import { IProfileData } from '@akashaproject/design-system/lib/components/Cards/profile-cards/profile-widget-card';

export const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
export const randomMs = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const generateProfileData = (ethAddress: string): IProfileData => {
  return {
    ethAddress,
    coverImage: 'goldenrod',
    name: 'AKASHA WORLD',
    description:
      'Product design @companyname. Main interests: User experience, Design processes, Project Managament. Author of This could be a book name, and Another Book. Love people, plants, words, and food.',
    apps: '12',
    profileType: 'user',
  };
};
const contentStrings = [
  'We’re back in action, energized after an epic retreat in #verbier 🇨🇭 🤜💥🤛',
  'Here’s to everyone keeping us in their minds and hearts 🥂',
  'You’ve been in our hearts and minds as well! 🤗',
  'Looking forward to sharing our insights and plans in the coming days!',
  '#AKASHAReloaded #AKASHAFoundation',
  '第十章 第八章 第二章 第六章 第九章.',
  '第十六章 第十一章 第十四章 第十二章',
  '關雎 ，可 耳 曰： 覽. 出 事 矣 誨 耳 去. 也懊悔不了 此是後話 饒爾去罷」 ，愈聽愈惱. 矣 事 」 覽 出 ，可 關雎',
  'Тя Аз Ах изобразуют бессмертие геройством насытиться со ль',
  'Кто меч там Ходя душу есть идет Вам.',
];

export const genEntryData = (entryId: string) => ({
  entryId,
  ethAddress: '0x003410490059837320006570047391024572000',
  name: 'AKASHA WORLD',
  avatar: 'http://placebeard.it/480/480',
  content: contentStrings
    .slice(Math.floor(Math.random() * Math.floor(3)), Math.floor(Math.random() * Math.floor(9)))
    .join('. '),
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
  ],
  quotes: [
    {
      ethAddress: '0x003410490050000320006570047391024572000',
      name: 'Gigi Patratel',
      time: '1572036522',
      avatar: 'http://placebeard.it/480/480',
    },
  ],
});

export const genEthAddress = () => {
  const arr = new Uint8Array(20);
  crypto.getRandomValues(arr);
  const addr = Array.from(arr, v => v.toString(16).substr(-2)).join('');
  return `0x${addr}`;
};

export const loggedEthAddress = genEthAddress();
