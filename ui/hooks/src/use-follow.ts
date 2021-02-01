import * as React from 'react';
import { IAkashaError } from '@akashaproject/ui-awf-typings';
import { filter } from 'rxjs/operators';

export interface UseFollowActions {
  isFollowing: (loggedEthAddress: string, followEthAddress: string) => void;
  follow: (followEthAddress: string) => void;
  unfollow: (followEthAddress: string) => void;
}

export interface UseFollowProps {
  onError?: (error: IAkashaError) => void;
  profileService: any;
  globalChannel: any;
}

/* A hook with follow, unfollow and isFollowing functionality */
export const useFollow = (props: UseFollowProps): [string[], UseFollowActions] => {
  const { onError, profileService, globalChannel } = props;
  const [isFollowingState, setIsFollowingState] = React.useState<string[]>([]);

  const handleSubscribe = (payload: any) => {
    const { data, channelInfo } = payload;
    if (data.follow && !isFollowingState.includes(channelInfo.args.ethAddress)) {
      setIsFollowingState(prev => [...prev, channelInfo.args.ethAddress]);
    }
    if (data.unFollow) {
      setIsFollowingState(prev => prev.filter(profile => profile !== channelInfo.args.ethAddress));
    }
  };

  const handleError = (err: Error) => {
    if (onError) {
      onError({
        errorKey: 'useFollow.globalFollow',
        error: err,
        critical: false,
      });
    }
  };

  // this is used to sync following state between different components using the hook
  React.useEffect(() => {
    const call = globalChannel.pipe(
      filter((payload: any) => {
        return (
          (payload.channelInfo.method === 'follow' || payload.channelInfo.method === 'unFollow') &&
          payload.channelInfo.servicePath.includes('PROFILE_STORE')
        );
      }),
    );
    call.subscribe(handleSubscribe, handleError);
    return () => call.unsubscribe();
  }, []);

  const actions: UseFollowActions = {
    isFollowing(loggedEthAddress, followEthAddress) {
      try {
        const call = profileService.isFollowing({
          follower: loggedEthAddress,
          following: followEthAddress,
        });
        call.subscribe((resp: { data: { isFollowing: boolean } }) => {
          if (resp.data.isFollowing && !isFollowingState.includes(followEthAddress)) {
            setIsFollowingState(prev => [...prev, followEthAddress]);
          } else if (!resp.data.isFollowing && isFollowingState.includes(followEthAddress)) {
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
          if (resp.data.follow && !isFollowingState.includes(followEthAddress)) {
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
