import React from 'react';
import objHash from 'object-hash';
import { Query, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import getSDK from '@akashaorg/awf-sdk';
import { IProfileData } from '@akashaorg/typings/ui';
import { logError } from './utils/error-handler';
import { TRENDING_PROFILES_KEY } from './use-trending';
import { FOLLOWERS_KEY, PROFILE_KEY } from './use-profile';

/**
 * @internal
 */
export const FOLLOWED_PROFILES_KEY = 'Followed_Profiles';
export const CONTACT_LIST_KEY = 'Contact_List';

const getIsFollowingMultiple = async (followerPubKey: string, followingPubKeyArray: string[]) => {
  const sdk = getSDK();
  const filteredList = followingPubKeyArray.filter(profile => !!profile);
  const getFollowedProfilesCalls = filteredList.map((profile: string) => {
    return sdk.api.profile.isFollowing({
      follower: followerPubKey,
      following: profile,
    });
  });
  const followedProfiles: string[] = [];
  if (getFollowedProfilesCalls.length) {
    const res = await Promise.all(getFollowedProfilesCalls);
    filteredList.forEach((profile, index) => {
      if (res[index]?.isFollowing === true) {
        followedProfiles.push(profile);
      }
    });
  }
  return followedProfiles;
};

const deduplicateArray = (arr: string[]): string[] => [...new Set(arr)];

class GetFollowingBuffer {
  static buffer: string[] = [];

  static addToBuffer(arr: string[]) {
    this.buffer = deduplicateArray([...this.buffer, ...arr]);
  }
}

/**
 * Hook to check if a user is following other users
 * @example useIsFollowingMultiple hook
 * ```typescript
 * const isFollowingMultipleQuery = useIsFollowingMultiple('user-pubkey', ['some-pubkey-1', 'some-pubkey-2']);
 *
 * const followedProfiles = isFollowingMultipleQuery.data;
 * ```
 */
export function useIsFollowingMultiple(followerPubKey: string, followingPubKeyArray: string[]) {
  const queryClient = useQueryClient();
  const [refetchPending, setRefetchPending] = React.useState(false);
  const filteredFollowingPubKeyArray = followingPubKeyArray.filter(_ => _); // often we end up with [undefined] as arg
  const allPubKeys: string[] = queryClient.getQueryData([FOLLOWED_PROFILES_KEY, 'all']) || [];
  const newAllPubKeys = deduplicateArray([...allPubKeys, ...filteredFollowingPubKeyArray]);

  const query = useQuery(
    [FOLLOWED_PROFILES_KEY],
    async () => {
      const tempBuffer = GetFollowingBuffer.buffer;
      GetFollowingBuffer.buffer = [];
      const newFollowedProfiles = await getIsFollowingMultiple(followerPubKey, tempBuffer);

      const followedProfiles: string[] = queryClient.getQueryData([FOLLOWED_PROFILES_KEY]) || [];
      return deduplicateArray([...followedProfiles, ...newFollowedProfiles]);
    },
    {
      enabled: !!(followerPubKey && GetFollowingBuffer.buffer.length),
      keepPreviousData: false,
      initialData: [],
      onError: (err: Error) => logError('useFollow.useIsFollowingMultiple', err),
      onSuccess: () => {
        setRefetchPending(false);
      },
    },
  );

  React.useEffect(() => {
    const shouldRefetch = objHash(newAllPubKeys) !== objHash(allPubKeys);
    if (shouldRefetch && !refetchPending) {
      queryClient.setQueryData([FOLLOWED_PROFILES_KEY, 'all'], newAllPubKeys);
      GetFollowingBuffer.addToBuffer(filteredFollowingPubKeyArray);
      setRefetchPending(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newAllPubKeys, allPubKeys, filteredFollowingPubKeyArray, refetchPending]);

  React.useEffect(() => {
    if (!query.isFetching && refetchPending && followerPubKey && GetFollowingBuffer.buffer.length) {
      query.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchPending, query.isFetching, followerPubKey]);

  return query;
}

const getIsContactMultiple = async (mainProfile: string, checkIfContactsPubkeys: string[]) => {
  const sdk = getSDK();
  const filteredList = checkIfContactsPubkeys.filter(profile => !!profile);
  const getFollowedProfilesCalls = filteredList.map((profile: string) => {
    return sdk.api.profile.isFollowing({
      follower: mainProfile,
      following: profile,
    });
  });
  const getFollowingProfilesCalls = filteredList.map((profile: string) => {
    return sdk.api.profile.isFollowing({
      follower: profile,
      following: mainProfile,
    });
  });
  const followedProfiles: string[] = [];
  const followingProfiles: string[] = [];
  if (getFollowedProfilesCalls.length) {
    const res = await Promise.all(getFollowedProfilesCalls);
    filteredList.forEach((profile, index) => {
      if (res[index].isFollowing === true) {
        followedProfiles.push(profile);
      }
    });
  }
  if (getFollowingProfilesCalls.length) {
    const res = await Promise.all(getFollowingProfilesCalls);
    filteredList.forEach((profile, index) => {
      if (res[index].isFollowing === true) {
        followingProfiles.push(profile);
      }
    });
  }
  const contactList = followedProfiles.filter(followedProfile =>
    followingProfiles.includes(followedProfile),
  );
  return contactList;
};

class GetContactListBuffer {
  static buffer: string[] = [];

  static addToBuffer(arr: string[]) {
    this.buffer = deduplicateArray([...this.buffer, ...arr]);
  }
}

/**
 * Hook to check if a list of profiles are contacts for a specific user
 * A contact relationship is defined by each of the two profiles following each other
 * @example useIsContactMultiple hook
 * ```typescript
 * const isContactMultipleQuery = useIsContactMultiple('user-pubkey', ['some-pubkey-1', 'some-pubkey-2']);
 *
 * const contactList = isContactMultipleQuery.data;
 * ```
 */
export function useIsContactMultiple(mainProfile: string, checkIfContactsPubkeys: string[]) {
  const queryClient = useQueryClient();
  const [refetchPending, setRefetchPending] = React.useState(false);
  const filteredCheckIfContactsPubkeys = checkIfContactsPubkeys.filter(_ => _); // often we end up with [undefined] as arg
  const allPubKeys: string[] = queryClient.getQueryData([CONTACT_LIST_KEY, 'all']) || [];
  const newAllPubKeys = deduplicateArray([...allPubKeys, ...filteredCheckIfContactsPubkeys]);

  const query = useQuery(
    [CONTACT_LIST_KEY],
    async () => {
      const tempBuffer = GetContactListBuffer.buffer;
      GetContactListBuffer.buffer = [];
      const newContactList = await getIsContactMultiple(mainProfile, tempBuffer);

      const contactList: string[] = queryClient.getQueryData([CONTACT_LIST_KEY]) || [];
      return deduplicateArray([...contactList, ...newContactList]);
    },
    {
      enabled: !!(mainProfile && GetContactListBuffer.buffer.length),
      keepPreviousData: false,
      initialData: [],
      onError: (err: Error) => logError('useFollow.useIsContactMultiple', err),
      onSuccess: () => {
        setRefetchPending(false);
      },
    },
  );

  React.useEffect(() => {
    const shouldRefetch = objHash(newAllPubKeys) !== objHash(allPubKeys);
    if (shouldRefetch && !refetchPending) {
      queryClient.setQueryData([CONTACT_LIST_KEY, 'all'], newAllPubKeys);
      GetContactListBuffer.addToBuffer(filteredCheckIfContactsPubkeys);
      setRefetchPending(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newAllPubKeys, allPubKeys, filteredCheckIfContactsPubkeys, refetchPending]);

  React.useEffect(() => {
    if (!query.isFetching && refetchPending && mainProfile && GetContactListBuffer.buffer.length) {
      query.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchPending, query.isFetching, mainProfile]);

  return query;
}

// const getIsFollowing = async (followerEthAddress: string, followingEthAddress: string) => {
//   const sdk = getSDK();
//   try {
//     const res = await lastValueFrom(
//       sdk.api.profile.isFollowing({
//         follower: followerEthAddress,
//         following: followingEthAddress,
//       }),
//     );
//
//     return res.data.isFollowing;
//   } catch (error) {
//     logError('useFollow.getIsFollowing', error);
//     throw error;
//   }
// };
//
// export function useIsFollowing(followerEthAddress, followingEthAddress, enabled = true) {
//   const queryClient = useQueryClient();
//   return useQuery(
//     [FOLLOWED_PROFILES_KEY],
//     async () => {
//       const followedProfiles: string[] = queryClient.getQueryData([FOLLOWED_PROFILES_KEY]) || [];
//       let updatedFollowedProfiles = [...followedProfiles];
//       const isFollowing = await getIsFollowing(followerEthAddress, followingEthAddress);
//       if (isFollowing && !followedProfiles.includes(followingEthAddress)) {
//         updatedFollowedProfiles = [...followedProfiles, followingEthAddress];
//       } else if (!isFollowing) {
//         updatedFollowedProfiles = followedProfiles.filter(
//           profile => profile === followingEthAddress,
//         );
//       }
//       return updatedFollowedProfiles;
//     },
//     {
//       enabled: !!followerEthAddress && !!followingEthAddress && enabled,
//       keepPreviousData: false,
//     },
//   );
// }

/**
 * Hook to follow another user
 * @example useFollow hook
 * ```typescript
 * const followQuery = useFollow();
 *
 * followQuery.mutate('pubkey-of-user-to-follow');
 * ```
 */
export function useFollow() {
  const sdk = getSDK();
  const queryClient = useQueryClient();
  return useMutation(followPubKey => sdk.api.profile.follow(followPubKey), {
    onMutate: async (followPubKey: string) => {
      await queryClient.cancelQueries([FOLLOWED_PROFILES_KEY]);
      // Snapshot the previous value
      const previousFollowedProfiles: string[] =
        (await queryClient.getQueryData([FOLLOWED_PROFILES_KEY])) || [];

      if (!previousFollowedProfiles.includes(followPubKey)) {
        queryClient.setQueryData(
          [FOLLOWED_PROFILES_KEY],
          [...previousFollowedProfiles, followPubKey],
        );
      }
      return { previousFollowedProfiles };
    },
    onSuccess: async (_data, vars) => {
      const followPubKey = vars;
      queryClient.setQueryData<IProfileData[]>([TRENDING_PROFILES_KEY], prev => {
        return prev.map(profile => {
          if (profile.pubKey === followPubKey) {
            const followersCount = profile.totalFollowers;
            let totalFollowers: number;
            if (typeof followersCount === 'number') {
              totalFollowers = Math.max(followersCount + 1);
            } else {
              totalFollowers = Math.max(0, parseInt(followersCount, 10) + 1);
            }
            return {
              ...profile,
              totalFollowers,
            };
          }
          return profile;
        });
      });
      // invalidate the queries of the profile if it's already fetched
      // eg. we are on his profile page
      const profileQuery = queryClient.getQueriesData<IProfileData>({
        queryKey: [PROFILE_KEY],
        predicate: (query: Query<IProfileData>) => {
          return query.state.data && query.state.data.pubKey === followPubKey;
        },
      })[0];
      if (profileQuery) {
        const [, profile] = profileQuery;
        if (profile) {
          await queryClient.invalidateQueries([PROFILE_KEY, profile.pubKey]);
          await queryClient.invalidateQueries([FOLLOWERS_KEY, profile.pubKey]);
        }
      } else {
        const sdk = getSDK();
        const user = await sdk.api.auth.getCurrentUser();
        if (user) {
          await queryClient.invalidateQueries([PROFILE_KEY, user.pubKey]);
          await queryClient.invalidateQueries([FOLLOWERS_KEY, user.pubKey]);
        }
      }
    },
    onError: (err, variables, context) => {
      if (context?.previousFollowedProfiles) {
        queryClient.setQueryData([FOLLOWED_PROFILES_KEY], context.previousFollowedProfiles);
      }
      logError('useFollow.follow', err as Error);
    },
  });
}

/**
 * Hook to unfollow another user
 * @example useUnfollow hook
 * ```typescript
 * const unfollowQuery = useUnfollow();
 *
 * unfollowQuery.mutate('pubkey-of-user-to-unfollow');
 * ```
 */
export function useUnfollow() {
  const sdk = getSDK();
  const queryClient = useQueryClient();
  return useMutation(unfollowPubKey => sdk.api.profile.unFollow(unfollowPubKey), {
    onMutate: async (unfollowPubKey: string) => {
      await queryClient.cancelQueries([FOLLOWED_PROFILES_KEY]);
      // Snapshot the previous value
      const previousFollowedProfiles: string[] =
        (await queryClient.getQueryData([FOLLOWED_PROFILES_KEY])) || [];
      const updatedFollowedProfiles = previousFollowedProfiles.filter(
        profile => profile !== unfollowPubKey,
      );
      queryClient.setQueryData([FOLLOWED_PROFILES_KEY], updatedFollowedProfiles);

      return { previousFollowedProfiles };
    },
    onSuccess: async (_data, vars) => {
      const unfollowPubKey = vars;
      queryClient.setQueryData<IProfileData[]>([TRENDING_PROFILES_KEY], prev => {
        return prev.map(profile => {
          if (profile.pubKey === unfollowPubKey) {
            const followersCount = profile.totalFollowers;
            let totalFollowers: number;
            if (typeof followersCount === 'number') {
              totalFollowers = followersCount - 1;
            } else {
              totalFollowers = parseInt(followersCount, 10) - 1;
            }
            return {
              ...profile,
              totalFollowers,
            };
          }
          return profile;
        });
      });
      // invalidate the queries of the profile if it's already fetched
      // eg. we are on his profile page
      const profileQuery = queryClient.getQueriesData<IProfileData>({
        queryKey: [PROFILE_KEY],
        predicate: (query: Query<IProfileData>) => {
          return query.state.data && query.state.data.pubKey === unfollowPubKey;
        },
      })[0];
      if (profileQuery) {
        const [, profile] = profileQuery;
        if (profile) {
          await queryClient.invalidateQueries([PROFILE_KEY, profile.pubKey]);
          await queryClient.invalidateQueries([FOLLOWERS_KEY, profile.pubKey]);
        }
      } else {
        const sdk = getSDK();
        const user = await sdk.api.auth.getCurrentUser();
        if (user) {
          await queryClient.invalidateQueries([PROFILE_KEY, user.pubKey]);
          await queryClient.invalidateQueries([FOLLOWERS_KEY, user.pubKey]);
        }
      }
    },
    onError: (err, variables, context) => {
      if (context?.previousFollowedProfiles) {
        queryClient.setQueryData([FOLLOWED_PROFILES_KEY], context.previousFollowedProfiles);
      }
      logError('useFollow.unfollow', err as Error);
    },
    // onSettled: async () => {
    //   await queryClient.invalidateQueries([FOLLOWED_PROFILES_KEY]);
    // },
  });
}
