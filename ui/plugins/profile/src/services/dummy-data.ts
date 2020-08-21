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
    avatar: 'http://placebeard.it/480/480',
    name: 'AKASHA WORLD',
    userName: '@akashaworld',
    ensName: 'akashaworld.akasha.eth',
    description:
      'Product design @companyname. Main interests: User experience, Design processes, Project Managament. Author of This could be a book name, and Another Book. Love people, plants, words, and food.',
    apps: '12',
    profileType: 'user',
  };
};

export const genEthAddress = () => {
  const arr = new Uint8Array(20);
  crypto.getRandomValues(arr);
  const addr = Array.from(arr, v => v.toString(16).substr(-2)).join('');
  return `0x${addr}`;
};

export const loggedEthAddress = genEthAddress();
