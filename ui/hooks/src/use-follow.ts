import * as React from 'react';
import { IAkashaError } from '@akashaproject/ui-awf-typings';

export interface UseFollowActions {
  isFollowing: (loggedEthAddress: string, followEthAddress: string) => void;
  follow: (followEthAddress: string) => void;
  unFollow: (followEthAddress: string) => void;
}

export interface UseFollowProps {
  onError?: (error: IAkashaError) => void;
  profileService: any;
}

/* A hook with following functionality */
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
        profileService.follow({ followEthAddress });
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
    unFollow(followEthAddress) {
      try {
        profileService.unFollow({ followEthAddress });
      } catch (ex) {
        if (onError) {
          onError({
            errorKey: 'useFollow.unFollow',
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
