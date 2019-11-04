import {
  IProfile,
  IGetLoggedProfilePayload,
  IGetProfilesPayload,
  IGetProfileFollowingsPayload,
  IGetProfileFollowersPayload,
} from '../state/profiles/interfaces';

const profileData: IProfile = {
  avatar: 'http://placebeard.it/640/480',
  coverImage: 'goldenrod',
  name: 'Gilbert The Bearded',
  // userName: '@gilbert',
  description:
    'Product design @companyname. Main interests: User experience, Design processes, Project Managament. Author of This could be a book name, and Another Book. Love people, plants, words, and food.',
  // followers: '15',
  // following: '1876',
  // apps: '12',
  // profileType: 'user',
  ethAddress: '0x011',
};

export const fetchLoggedProfile = (): Promise<IGetLoggedProfilePayload> => {
  return Promise.resolve({ loggedProfile: '0x011' });
};

export const fetchProfileData = (profile: string[] | string): Promise<IGetProfilesPayload> => {
  if (Array.isArray(profile)) {
    // send the array direcly
    return Promise.resolve({
      profiles: [profileData, { ...profileData, name: 'BeardyMan', ethAddress: '0x012' }],
    });
  }
  // send an array with one item
  return Promise.resolve({
    profiles: [profileData],
  });
};

export const fetchProfileFollowings = (
  profileIds: string | string[],
): Promise<IGetProfileFollowingsPayload> => {
  if (Array.isArray(profileIds)) {
    // fetch multi profiles followings
    return Promise.resolve([{ profileId: '0x011', followings: 123 }]);
  }
  return Promise.resolve([{ profileId: '0x011', followings: 123 }]);
};

export const fetchProfileFollowers = (
  profileIds: string | string[],
): Promise<IGetProfileFollowersPayload> => {
  if (Array.isArray(profileIds)) {
    return Promise.resolve([{ profileId: '0x011', followers: 100 }]);
  }
  return Promise.resolve([{ profileId: '0x011', followers: 100 }]);
};
