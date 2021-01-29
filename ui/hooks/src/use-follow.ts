import * as React from 'react';
import { IAkashaError } from '@akashaproject/ui-awf-typings';

export interface UseFollowActions {
  isFollowing: (loggedEthAddress: string, followEthAddress: string) => void;
  follow: (followEthAddress: string) => void;
  unfollow: (followEthAddress: string) => void;
}

export interface UseFollowProps {
  onError?: (error: IAkashaError) => void;
  profileService: any;
}

/* A hook with follow, unfollow and isFollowing functionality */
export const useFollow = (props: UseFollowProps): [string[], UseFollowActions] => {
  const { onError, profileService } = props;
  const [isFollowingState, setIsFollowingState] = React.useState<string[]>([]);

  const actions: UseFollowActions = {
    isFollowing(loggedEthAddress, followEthAddress) {
      try {
        const call = profileService.isFollowing({
          follower: loggedEthAddress,
          following: followEthAddress,
        });
        call.subscribe((resp: { data: { isFollowing: boolean } }) => {
          if (resp.data.isFollowing) {
            setIsFollowingState((followedProfiles: string[]) =>
              followedProfiles.concat(followEthAddress),
            );
          } else if (resp.data.isFollowing === false) {
            setIsFollowingState(prev => prev.filter(profile => profile !== followEthAddress));
          }
        });
      } catch (ex) {
        if (onError) {
          onError({
            errorKey: 'useFollow.isFollowing',
            error: ex,
            critical: false,
          });
        }
      }
    },

    follow(followEthAddress) {
      try {
        const call = profileService.follow({ ethAddress: followEthAddress });
        call.subscribe((resp: any) => {
          if (resp.data.follow) {
            setIsFollowingState(prev => [...prev, followEthAddress]);
          }
        });
      } catch (ex) {
        if (onError) {
          onError({
            errorKey: 'useFollow.follow',
            error: ex,
            critical: false,
          });
        }
      }
    },
    unfollow(unfollowEthAddress) {
      try {
        const call = profileService.unFollow({ ethAddress: unfollowEthAddress });
        call.subscribe((resp: any) => {
          if (resp.data.unFollow) {
            setIsFollowingState(prev => prev.filter(profile => profile !== unfollowEthAddress));
          }
        });
      } catch (ex) {
        if (onError) {
          onError({
            errorKey: 'useFollow.unfollow',
            error: ex,
            critical: false,
          });
        }
      }
    },
  };

  return [isFollowingState, actions];
};

export default useFollow;
