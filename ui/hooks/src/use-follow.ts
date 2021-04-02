import * as React from 'react';
import { IAkashaError } from '@akashaproject/ui-awf-typings';
import { createErrorHandler } from './utils/error-handler';

export interface UseFollowActions {
  isFollowing: (loggedEthAddress: string, followEthAddress: string) => void;
  follow: (followEthAddress: string) => void;
  unfollow: (followEthAddress: string) => void;
}

export interface UseFollowProps {
  onError?: (error: IAkashaError) => void;
  profileService: any;
  globalChannel: any;
  rxjsOperators: any;
}

/* A hook with follow, unfollow and isFollowing functionality */
export const useFollow = (props: UseFollowProps): [string[], UseFollowActions] => {
  const { onError, profileService, globalChannel, rxjsOperators } = props;
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

  // this is used to sync following state between different components using the hook
  React.useEffect(() => {
    const call = globalChannel.pipe(
      rxjsOperators.filter((payload: any) => {
        return (
          (payload.channelInfo.method === 'follow' || payload.channelInfo.method === 'unFollow') &&
          payload.channelInfo.servicePath.includes('PROFILE_STORE')
        );
      }),
    );
    call.subscribe(handleSubscribe, createErrorHandler('useFollow.globalFollow', false, onError));
    return () => call.unsubscribe();
  }, []);

  const actions: UseFollowActions = {
    isFollowing(loggedEthAddress, followEthAddress) {
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
      }, createErrorHandler('useFollow.isFollowing', false, onError));
    },

    follow(followEthAddress) {
      const call = profileService.follow({ ethAddress: followEthAddress });
      setIsFollowingState(prev => [...prev, followEthAddress]);
      call.subscribe((resp: any) => {
        if (resp.data.follow && !isFollowingState.includes(followEthAddress)) {
          setIsFollowingState(prev => [...prev, followEthAddress]);
        }
      }, createErrorHandler('useFollow.follow', false, onError));
    },
    unfollow(unfollowEthAddress) {
      const call = profileService.unFollow({ ethAddress: unfollowEthAddress });
      setIsFollowingState(prev => prev.filter(profile => profile !== unfollowEthAddress));
      call.subscribe((resp: any) => {
        if (resp.data.unFollow) {
          setIsFollowingState(prev => prev.filter(profile => profile !== unfollowEthAddress));
        }
      }, createErrorHandler('useFollow.unfollow', false, onError));
    },
  };

  return [isFollowingState, actions];
};

export default useFollow;
