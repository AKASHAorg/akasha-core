import { useCallback, useState } from 'react';
import { Follow } from '../type';

const FOLLOWINGS = '@followings';

/* TODO: remove this hook and replace it with a hook that fetches isFollowing flag and follow stream id of a profile*/
export function useFollowingsOfLoggedInProfile(loggedInProfileId: string) {
  const [followingsOfLoggedInProfile, setFollowingsOfLoggedInProfile] = useState(
    getFollowingsOfLoggedInProfileFromLocalStorage(loggedInProfileId),
  );

  const followProfile = (followerId: string, followedId: string, streamId: string) => {
    const followings = followingsOfLoggedInProfile.get(followerId);
    const foundFollowing = followings?.find(followingId => followingId[followedId]);

    if (foundFollowing) {
      editFollowProfile(followerId, followedId, true);
      return;
    }

    const _followingsOfLoggedInProfile = new Map(
      followingsOfLoggedInProfile.set(followerId, [
        ...(followingsOfLoggedInProfile.get(followerId) || []),
        { [followedId]: { streamId, isFollowing: true } },
      ]),
    );
    setFollowingsOfLoggedInProfile(_followingsOfLoggedInProfile);

    localStorage.setItem(
      `${FOLLOWINGS}_${loggedInProfileId}`,
      JSON.stringify(Object.fromEntries(_followingsOfLoggedInProfile)),
    );
  };

  const unFollowProfile = (followerId: string, followedId: string) => {
    editFollowProfile(followerId, followedId, false);
  };

  const editFollowProfile = (followerId: string, followedId: string, isFollowing: boolean) => {
    let followProfileExists = false;

    const followings = followingsOfLoggedInProfile.get(followerId)?.map(followingId => {
      if (followingId[followedId]) {
        followProfileExists = true;
        return { [followedId]: { ...followingId[followedId], isFollowing } };
      }
      return followingId;
    });

    if (followProfileExists) {
      const _followingsOfLoggedInProfile = new Map(
        followingsOfLoggedInProfile.set(followerId, followings),
      );

      setFollowingsOfLoggedInProfile(_followingsOfLoggedInProfile);

      localStorage.setItem(
        `${FOLLOWINGS}_${loggedInProfileId}`,
        JSON.stringify(Object.fromEntries(_followingsOfLoggedInProfile)),
      );
    }
  };

  const getFollowing = useCallback(
    (followerId: string, followedId: string): Follow | null => {
      const followings = followingsOfLoggedInProfile.get(followerId);
      const foundFollowing = followings?.find(followingId => followingId[followedId]);

      return foundFollowing ? foundFollowing[followedId] : null;
    },
    [followingsOfLoggedInProfile],
  );

  return { followProfile, unFollowProfile, getFollowing };
}

const getFollowingsOfLoggedInProfileFromLocalStorage = (loggedInProfileId: string) => {
  const followingsOfLoggedInProfileMap = new Map<string, Record<string, Follow>[]>();
  const followingsOfLoggedInProfileObj =
    JSON.parse(localStorage.getItem(`${FOLLOWINGS}_${loggedInProfileId}`)) || {};

  Object.keys(followingsOfLoggedInProfileObj).forEach(key => {
    followingsOfLoggedInProfileMap.set(key, followingsOfLoggedInProfileObj[key]);
  });

  return followingsOfLoggedInProfileMap;
};
