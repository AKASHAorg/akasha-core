import { Query, useMutation, useQuery, useQueryClient } from 'react-query';
import { lastValueFrom, forkJoin, BehaviorSubject, concatMap, EMPTY, first, share } from 'rxjs';
import getSDK from '@akashaproject/awf-sdk';
import { IProfileData } from '@akashaproject/ui-awf-typings/lib/profile';
import { logError } from './utils/error-handler';
import { TRENDING_PROFILES_KEY } from './use-trending.new';
import { FOLLOWERS_KEY, PROFILE_KEY } from './use-profile.new';

export const FOLLOWED_PROFILES_KEY = 'Followed_Profiles';

enum FOLLOW_TYPES {
  follow = 1,
  unFollow,
}

const getIsFollowingMultiple = async (
  followerEthAddress: string,
  followingEthAddressArray: string[],
) => {
  const sdk = getSDK();
  try {
    const filteredList = followingEthAddressArray.filter(profile => !!profile);
    const getFollowedProfilesCalls = filteredList.map((profile: string) => {
      return sdk.api.profile.isFollowing({
        follower: followerEthAddress,
        following: profile,
      });
    });
    const followedProfiles: string[] = [];
    if (getFollowedProfilesCalls.length) {
      const res = await lastValueFrom(forkJoin(getFollowedProfilesCalls));
      filteredList.forEach((profile, index) => {
        if (res[index].data.isFollowing === true) {
          followedProfiles.push(profile);
        }
      });
    }
    return followedProfiles;
  } catch (error) {
    logError('useFollow.getIsFollowingMultiple', error);
  }
};

export function useIsFollowingMultiple(
  followerEthAddress: string,
  followingEthAddressArray: string[],
) {
  const queryClient = useQueryClient();
  return useQuery(
    [FOLLOWED_PROFILES_KEY],
    async () => {
      const followedProfiles: string[] = queryClient.getQueryData([FOLLOWED_PROFILES_KEY]) || [];

      const newFollowedProfiles = await getIsFollowingMultiple(
        followerEthAddress,
        followingEthAddressArray,
      );
      const filteredNewProfiles = newFollowedProfiles.filter(followedEthAddress => {
        return !followedProfiles.length || !followedProfiles.includes(followedEthAddress);
      });

      return [...followedProfiles, ...filteredNewProfiles];
    },
    {
      enabled: !!(followerEthAddress && followingEthAddressArray?.length),
      keepPreviousData: false,
      initialData: [],
    },
  );
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

class FollowQueue {
  static sdk = getSDK();
  static queue = new BehaviorSubject(null);
  static results = this.queue.pipe(
    concatMap(async val => {
      if (!val || !FOLLOW_TYPES[val.type]) return EMPTY;
      const response = await lastValueFrom(this.sdk.api.profile[val.type](val.ethAddress));
      return { ...val, response };
    }),
    share(),
  );
  static addToQueue(obj) {
    this.queue.next(obj);
  }
}

export function useFollow() {
  const queryClient = useQueryClient();
  return useMutation(
    followEthAddress => {
      const input = { type: 'follow', ethAddress: followEthAddress, ts: Date.now() };
      FollowQueue.addToQueue(input);
      return lastValueFrom(FollowQueue.results.pipe(first(ev => ev.ts === input.ts)));
    },
    {
      onMutate: async (followEthAddress: string) => {
        await queryClient.cancelQueries(FOLLOWED_PROFILES_KEY);
        // Snapshot the previous value
        const previousFollowedProfiles: string[] =
          (await queryClient.getQueryData([FOLLOWED_PROFILES_KEY])) || [];
        if (!previousFollowedProfiles.includes(followEthAddress)) {
          queryClient.setQueryData(
            [FOLLOWED_PROFILES_KEY],
            [...previousFollowedProfiles, followEthAddress],
          );
        }
        return { previousFollowedProfiles };
      },
      onSuccess: async (_data, vars) => {
        const followEthAddress = vars;
        queryClient.setQueryData<IProfileData[]>([TRENDING_PROFILES_KEY], prev => {
          return prev.map(profile => {
            if (profile.ethAddress === followEthAddress) {
              const followersCount = profile.totalFollowers;
              let totalFollowers: number;
              if (typeof followersCount === 'number') {
                totalFollowers = followersCount + 1;
              } else {
                totalFollowers = parseInt(followersCount, 10) + 1;
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
          queryKey: PROFILE_KEY,
          predicate: (query: Query<IProfileData>) => {
            return query.state.data && query.state.data.ethAddress === followEthAddress;
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
          const user = await lastValueFrom(sdk.api.auth.getCurrentUser());
          if (user) {
            await queryClient.invalidateQueries([PROFILE_KEY, user.data?.pubKey]);
            await queryClient.invalidateQueries([FOLLOWERS_KEY, user.data?.pubKey]);
          }
        }
      },
      onError: (err, variables, context) => {
        if (context?.previousFollowedProfiles) {
          queryClient.setQueryData([FOLLOWED_PROFILES_KEY], context.previousFollowedProfiles);
        }
        logError('useFollow.follow', err as Error);
      },
    },
  );
}

export function useUnfollow() {
  const queryClient = useQueryClient();
  return useMutation(
    unfollowEthAddress => {
      const input = { type: 'unFollow', ethAddress: unfollowEthAddress, ts: Date.now() };
      FollowQueue.addToQueue(input);
      return lastValueFrom(FollowQueue.results.pipe(first(ev => ev.ts === input.ts)));
    },
    {
      onMutate: async (unfollowEthAddress: string) => {
        await queryClient.cancelQueries(FOLLOWED_PROFILES_KEY);
        // Snapshot the previous value
        const previousFollowedProfiles: string[] =
          (await queryClient.getQueryData([FOLLOWED_PROFILES_KEY])) || [];
        const updatedFollowedProfiles = previousFollowedProfiles.filter(
          profile => profile !== unfollowEthAddress,
        );
        queryClient.setQueryData([FOLLOWED_PROFILES_KEY], updatedFollowedProfiles);

        return { previousFollowedProfiles };
      },
      onSuccess: async (_data, vars) => {
        const unfollowEthAddress = vars;
        queryClient.setQueryData<IProfileData[]>([TRENDING_PROFILES_KEY], prev => {
          return prev.map(profile => {
            if (profile.ethAddress === unfollowEthAddress) {
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
          queryKey: PROFILE_KEY,
          predicate: (query: Query<IProfileData>) => {
            return query.state.data && query.state.data.ethAddress === unfollowEthAddress;
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
          const user = await lastValueFrom(sdk.api.auth.getCurrentUser());
          if (user) {
            await queryClient.invalidateQueries([PROFILE_KEY, user.data?.pubKey]);
            await queryClient.invalidateQueries([FOLLOWERS_KEY, user.data?.pubKey]);
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
    },
  );
}
