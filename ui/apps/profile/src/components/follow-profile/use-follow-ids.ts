import { useCallback, useState } from 'react';

const FOLLOW_IDS = '@followIds';

export function useFollowIds(loggedInProfileId: string) {
  const [followIds, setFollowIds] = useState(
    new Map<string, Record<string, string>[]>(
      Object.entries(JSON.parse(localStorage.getItem(`${FOLLOW_IDS}_${loggedInProfileId}`)) || {}),
    ),
  );
  const followProfile = (followerId: string, followedId: string, streamId: string) => {
    const _followIds = new Map(
      followIds.set(followerId, [...(followIds.get(followerId) || []), { [followedId]: streamId }]),
    );
    setFollowIds(_followIds);

    localStorage.setItem(
      `${FOLLOW_IDS}_${loggedInProfileId}`,
      JSON.stringify(Object.fromEntries(_followIds)),
    );
  };

  const unFollowProfile = (followerId: string, followedId: string) => {
    const followingIds = followIds.get(followerId)?.filter(followingId => !followingId[followedId]);

    if (followingIds) {
      const _followIds = new Map(followIds.set(followerId, followingIds));

      setFollowIds(_followIds);

      localStorage.setItem(
        `${FOLLOW_IDS}_${loggedInProfileId}`,
        JSON.stringify(Object.fromEntries(_followIds)),
      );
    }
  };

  const getFollowId = useCallback(
    (followerId: string, followedId: string) => {
      const followingIds = followIds.get(followerId);
      const foundFollowingId = followingIds?.find(followingId => followingId[followedId]);

      return foundFollowingId ? foundFollowingId[followedId] : '';
    },
    [followIds],
  );

  return { followProfile, unFollowProfile, getFollowId };
}
