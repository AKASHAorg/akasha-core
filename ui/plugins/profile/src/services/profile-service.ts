import {
  IGetLoggedProfilePayload,
  IGetProfileFollowingsPayload,
  IGetProfileFollowersPayload,
} from '../state/profiles/interfaces';
import { IProfileData } from '@akashaproject/design-system/lib/components/Cards/profile-card';
import {
  generateProfileData,
  genEthAddress,
  delay,
  randomMs,
  loggedEthAddress,
} from './dummy-data';

export const fetchLoggedProfile = (): Promise<IGetLoggedProfilePayload> => {
  return delay(randomMs(500, 1500)).then(() =>
    Promise.resolve({ loggedProfile: loggedEthAddress }),
  );
  // return Promise.resolve({ loggedProfile: loggedEthAddress });
};

export const fetchProfileData = (payload: {
  profile: string[] | string;
}): Promise<{ profiles: IProfileData[] }> => {
  if (Array.isArray(payload.profile)) {
    // send the array direcly
    return Promise.resolve({
      profiles: payload.profile.map(p => generateProfileData(p)),
    });
  }
  // send an array with one item
  return delay(randomMs(0, 2000)).then(() =>
    Promise.resolve({
      profiles: [generateProfileData(payload.profile as string)],
    }),
  );
};

export const fetchProfileFollowings = (
  profileIds: string | string[],
): Promise<IGetProfileFollowingsPayload> => {
  if (Array.isArray(profileIds)) {
    // fetch multi profiles followings
    return Promise.resolve(profileIds.map(p => ({ profileId: p, followings: '123' })));
  }
  return Promise.resolve([{ profileId: profileIds, followings: '125' }]);
};

export const fetchProfileFollowers = (
  profileIds: string | string[],
): Promise<IGetProfileFollowersPayload> => {
  if (Array.isArray(profileIds)) {
    return Promise.resolve(profileIds.map(p => ({ profileId: p, followers: '1001' })));
  }
  return Promise.resolve([{ profileId: profileIds, followers: '100' }]);
};

export interface IFetchProfileFeed {
  profileId: string;
  startIdx: string;
  limit: number;
}

export const fetchProfileFeed = (payload: IFetchProfileFeed) => {
  return delay(randomMs(1000, 1000)).then(() =>
    Promise.resolve({
      feed: {
        profileId: payload.profileId,
        items: Array(payload.limit)
          .fill({})
          .map(() => ({ id: genEthAddress() })),
      },
    }),
  );
};

export const fetchFeedItemData = (payload: { entryId: string }) => {
  return delay(randomMs(100, 1000)).then(() =>
    Promise.resolve({
      entryId: payload.entryId,
      ethAddress: '0x003410490059837320006570047391024572000',
      name: 'AKASHA WORLD',
      avatar: 'http://placebeard.it/480/480',
      content:
        'We’re back in action, energized after an epic retreat in #verbier 🇨🇭 🤜💥🤛Here’s to everyone keeping us in their minds and hearts 🥂You’ve been in our hearts and minds as well! 🤗Looking forward to sharing our insights and plans in the coming days! 🚀#AKASHAReloaded #AKASHAFoundation',
      time: '1572036522',
      upvotes: 26,
      downvotes: 9,
    }),
  );
};
