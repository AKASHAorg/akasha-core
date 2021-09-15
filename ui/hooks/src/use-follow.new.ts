import { useMutation, useQuery, useQueryClient } from 'react-query';
import { lastValueFrom, forkJoin } from 'rxjs';
import getSDK from '@akashaproject/awf-sdk';
import { logError } from './utils/error-handler';

export const FOLLOWED_PROFILES_KEY = 'Followed_Profiles';

const getIsFollowingMultiple = async (followerEthAddress, followingEthAddressArray) => {
  const sdk = getSDK();
  try {
    const getFollowedProfilesCalls = followingEthAddressArray.map((profile: string) => {
      return sdk.api.profile.isFollowing({
        follower: followerEthAddress,
        following: profile,
      });
    });
    const res = await lastValueFrom(forkJoin(getFollowedProfilesCalls));
    const followedProfiles: string[] = [];
    followingEthAddressArray.map((profile, index) => {
      if (res[index].data.isFollowing === true) {
        followedProfiles.push(profile);
      }
    });

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
        if (followedProfiles && followedProfiles.includes(followedEthAddress)) {
          return;
        }
        return followedEthAddress;
      });

      return [...followedProfiles, ...filteredNewProfiles];
    },
    {
      initialData: [],
      enabled: !!(followerEthAddress && followingEthAddressArray?.length),
      keepPreviousData: true,
    },
  );
}

const getIsFollowing = async (followerEthAddress: string, followingEthAddress: string) => {
  const sdk = getSDK();
  try {
    const res = await lastValueFrom(
      sdk.api.profile.isFollowing({
        follower: followerEthAddress,
        following: followingEthAddress,
      }),
    );

    return res.data.isFollowing;
  } catch (error) {
    logError('useFollow.getIsFollowing', error);
    throw error;
  }
};

export function useIsFollowing(followerEthAddress, followingEthAddress, enabled = true) {
  const queryClient = useQueryClient();
  return useQuery(
    [FOLLOWED_PROFILES_KEY],
    async () => {
      const followedProfiles: string[] = queryClient.getQueryData([FOLLOWED_PROFILES_KEY]) || [];
      let updatedFollowedProfiles = [...followedProfiles];
      const isFollowing = await getIsFollowing(followerEthAddress, followingEthAddress);
      if (isFollowing && !followedProfiles.includes(followingEthAddress)) {
        updatedFollowedProfiles = [...followedProfiles, followingEthAddress];
      } else if (!isFollowing) {
        updatedFollowedProfiles = followedProfiles.filter(
          profile => profile === followingEthAddress,
        );
      }
      return updatedFollowedProfiles;
    },
    {
      initialData: [],
      enabled: !!followerEthAddress && !!followingEthAddress && enabled,
      keepPreviousData: true,
    },
  );
}

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
    onError: (err, variables, context) => {
      if (context?.previousFollowedProfiles) {
        queryClient.setQueryData([FOLLOWED_PROFILES_KEY], context.previousFollowedProfiles);
      }
      logError('useFollow.follow', err as Error);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries([FOLLOWED_PROFILES_KEY]);
    },
  });
}

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
      onError: (err, variables, context) => {
        if (context?.previousFollowedProfiles) {
          queryClient.setQueryData([FOLLOWED_PROFILES_KEY], context.previousFollowedProfiles);
        }
        logError('useFollow.unfollow', err as Error);
      },
      onSettled: async () => {
        await queryClient.invalidateQueries([FOLLOWED_PROFILES_KEY]);
      },
    },
  );
}
