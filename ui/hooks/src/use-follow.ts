import React from 'react';
import objHash from 'object-hash';
import { Query, useMutation, useQuery, useQueryClient } from 'react-query';
import { catchError, forkJoin, lastValueFrom, of } from 'rxjs';
import getSDK from '@akashaproject/awf-sdk';
import { IProfileData } from '@akashaproject/ui-awf-typings/lib/profile';
import { logError } from './utils/error-handler';
import { TRENDING_PROFILES_KEY } from './use-trending';
import { FOLLOWERS_KEY, PROFILE_KEY } from './use-profile';

export const FOLLOWED_PROFILES_KEY = 'Followed_Profiles';

const getIsFollowingMultiple = async (
  followerEthAddress: string,
  followingEthAddressArray: string[],
) => {
  const sdk = getSDK();
  const filteredList = followingEthAddressArray.filter(profile => !!profile);
  const getFollowedProfilesCalls = filteredList.map((profile: string) => {
    return sdk.api.profile
      .isFollowing({
        follower: followerEthAddress,
        following: profile,
      })
      .pipe(
        catchError(err => {
          logError('useFollow.getIsFollowingMultiple', err);
          return of({ data: null });
        }),
      );
  });
  const followedProfiles: string[] = [];
  if (getFollowedProfilesCalls.length) {
    const res = await lastValueFrom(forkJoin(getFollowedProfilesCalls));
    filteredList.forEach((profile, index) => {
      if (res[index].data?.isFollowing === true) {
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
 * @param followerEthAddress - ethereum address of user to check for
 * @param followingEthAddressArray - array of ethereum addresses to check if followed
 */
export function useIsFollowingMultiple(
  followerEthAddress: string,
  followingEthAddressArray: string[],
) {
  const queryClient = useQueryClient();
  const [refetchPending, setRefetchPending] = React.useState(false);
  const filteredFollowingEthArray = followingEthAddressArray.filter(_ => _); // often we end up with [undefined] as arg
  const allAddresses: string[] = queryClient.getQueryData([FOLLOWED_PROFILES_KEY, 'all']) || [];
  const newAllAddressess = deduplicateArray([...allAddresses, ...filteredFollowingEthArray]);
  const shouldRefetch = objHash(newAllAddressess) !== objHash(allAddresses);

  const query = useQuery(
    [FOLLOWED_PROFILES_KEY],
    async () => {
      const tempBuffer = GetFollowingBuffer.buffer;
      GetFollowingBuffer.buffer = [];
      const newFollowedProfiles = await getIsFollowingMultiple(followerEthAddress, tempBuffer);

      const followedProfiles: string[] = queryClient.getQueryData([FOLLOWED_PROFILES_KEY]) || [];
      return deduplicateArray([...followedProfiles, ...newFollowedProfiles]);
    },
    {
      enabled: !!(followerEthAddress && GetFollowingBuffer.buffer.length),
      keepPreviousData: false,
      initialData: [],
      onError: (err: Error) => logError('useFollow.useIsFollowingMultiple', err),
    },
  );

  React.useEffect(() => {
    if (shouldRefetch) {
      queryClient.setQueryData([FOLLOWED_PROFILES_KEY, 'all'], newAllAddressess);
      GetFollowingBuffer.addToBuffer(filteredFollowingEthArray);
      setRefetchPending(true);
    }
  }, [shouldRefetch]);

  React.useEffect(() => {
    if (!query.isFetching && refetchPending) {
      setRefetchPending(false);
      query.refetch();
    }
  }, [refetchPending, query.isFetching]);

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
 */
export function useFollow() {
  const sdk = getSDK();
  const queryClient = useQueryClient();
  return useMutation(followEthAddress => lastValueFrom(sdk.api.profile.follow(followEthAddress)), {
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
  });
}

/**
 * Hook to unfollow another user
 */
export function useUnfollow() {
  const sdk = getSDK();
  const queryClient = useQueryClient();
  return useMutation(
    unfollowEthAddress => lastValueFrom(sdk.api.profile.unFollow(unfollowEthAddress)),
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
