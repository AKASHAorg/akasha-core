import * as React from 'react';
import { IAkashaError } from '@akashaproject/ui-awf-typings';
import { createErrorHandler } from './utils/error-handler';
import { filter } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';
import getSDK from '@akashaproject/awf-sdk';
import { events } from '@akashaproject/sdk-typings';

export interface UseFollowActions {
  /**
   * check if one ethAddress follows another
   * @param followerEthAddress - ethAddress of profile that is the follower
   * @param followingEthAddress - ethAddress of profile that is followed
   */
  isFollowing: (followerEthAddress: string, followingEthAddress: string) => void;
  /**
   * check if one ethAddress follows multiple other ethAddresses
   * @param followerEthAddress - ethAddress of profile that is the follower
   * @param followingEthAddressArr - array of ethAddresses of profile that are followed
   */
  isFollowingMultiple: (followerEthAddress: string, followingEthAddressArray: string[]) => void;
  /**
   * follow a profile
   * @param followEthAddress - ethAddress of profile that the user wants to follow
   */
  follow: (followEthAddress: string) => void;
  /**
   * unfollow a profile
   * @param unfollowEthAddress - ethAddress of profile that the user wants to unfollow
   */
  unfollow: (unfollowEthAddress: string) => void;
}

export interface UseFollowProps {
  onError?: (error: IAkashaError) => void;
  profileService: any;
  globalChannel: any;
}

export interface IFollowState {
  isFollowingQuery: {
    followerEthAddress: string;
    followingEthAddress: string;
  } | null;
  isFollowingMultipleQuery: {
    followerEthAddress: string;
    followingEthAddressArray: string[];
  } | null;
  followQuery: string | null;
  unfollowQuery: string | null;
  followedProfiles: string[];
}

const initialFollowState = {
  isFollowingQuery: null,
  isFollowingMultipleQuery: null,
  followQuery: null,
  unfollowQuery: null,
  followedProfiles: [],
};

export type IFollowAction =
  | {
      type: 'IS_FOLLOWING';
      payload: {
        followerEthAddress: string;
        followingEthAddress: string;
      };
    }
  | {
      type: 'IS_FOLLOWING_SUCCESS';
      payload: {
        isFollowing: boolean;
        followingEthAddress: string;
      };
    }
  | {
      type: 'IS_FOLLOWING_MULTIPLE';
      payload: {
        followerEthAddress: string;
        followingEthAddressArray: string[];
      };
    }
  | {
      type: 'IS_FOLLOWING_MULTIPLE_SUCCESS';
      payload: string[];
    }
  | { type: 'FOLLOW'; payload: string }
  | {
      type: 'FOLLOW_SUCCESS';
      payload: {
        isFollowing: boolean;
        followEthAddress: string;
      };
    }
  | { type: 'UNFOLLOW'; payload: string }
  | {
      type: 'UNFOLLOW_SUCCESS';
      payload: {
        isUnfollowing: boolean;
        unfollowEthAddress: string;
      };
    };

const followStateReducer = (state: IFollowState, action: IFollowAction) => {
  switch (action.type) {
    case 'IS_FOLLOWING':
      return { ...state, isFollowingQuery: action.payload };
    case 'IS_FOLLOWING_SUCCESS': {
      const { isFollowing, followingEthAddress } = action.payload;
      if (isFollowing && !state.followedProfiles.includes(followingEthAddress)) {
        return {
          ...state,
          isFollowingQuery: null,
          followedProfiles: [...state.followedProfiles, followingEthAddress],
        };
      } else if (!isFollowing) {
        const filteredProfiles = state.followedProfiles.filter(
          profile => profile !== followingEthAddress,
        );
        return {
          ...state,
          isFollowingQuery: null,
          followedProfiles: filteredProfiles,
        };
      }
      return { ...state };
    }
    case 'IS_FOLLOWING_MULTIPLE':
      return { ...state, isFollowingMultipleQuery: action.payload };
    case 'IS_FOLLOWING_MULTIPLE_SUCCESS': {
      const updatedFollowedProfiles = action.payload.filter(followedEthAddress => {
        if (!state.followedProfiles.includes(followedEthAddress)) {
          return followedEthAddress;
        }
        return;
      });

      return {
        ...state,
        isFollowingMultipleQuery: null,
        followedProfiles: [...state.followedProfiles, ...updatedFollowedProfiles],
      };
    }
    case 'FOLLOW':
      return { ...state, followQuery: action.payload };
    case 'FOLLOW_SUCCESS': {
      const { isFollowing, followEthAddress } = action.payload;
      if (isFollowing && !state.followedProfiles.includes(followEthAddress)) {
        return {
          ...state,
          followQuery: null,
          followedProfiles: [...state.followedProfiles, followEthAddress],
        };
      }
      return { ...state };
    }

    case 'UNFOLLOW':
      return { ...state, unfollowQuery: action.payload };
    case 'UNFOLLOW_SUCCESS': {
      const { isUnfollowing, unfollowEthAddress } = action.payload;
      if (isUnfollowing) {
        const filteredProfiles = state.followedProfiles.filter(
          profile => profile !== unfollowEthAddress,
        );
        return {
          ...state,
          unfollowQuery: null,
          followedProfiles: filteredProfiles,
        };
      }
      return { ...state };
    }

    default:
      throw new Error('[UseFollowReducer] action is not defined!');
  }
};

/* A hook with follow, unfollow and isFollowing functionality */
export const useFollow = (props: UseFollowProps): [string[], UseFollowActions] => {
  const { onError, profileService } = props;
  const [followingState, dispatch] = React.useReducer(followStateReducer, initialFollowState);
  const sdk = getSDK();
  const handleSubscribe = (payload: any) => {
    const { data, channelInfo } = payload;
    if (data.follow) {
      dispatch({
        type: 'FOLLOW_SUCCESS',
        payload: { followEthAddress: channelInfo.args.ethAddress, isFollowing: data.follow },
      });
    }
    if (data.unFollow) {
      dispatch({
        type: 'UNFOLLOW_SUCCESS',
        payload: { unfollowEthAddress: channelInfo.args.ethAddress, isUnfollowing: data.unFollow },
      });
    }
  };

  // this is used to sync following state between different components using the hook
  React.useEffect(() => {
    const call = sdk.api.globalChannel.pipe(
      filter(payload => {
        return (
          payload.event === events.PROFILE_EVENTS.FOLLOW ||
          payload.event === events.PROFILE_EVENTS.UNFOLLOW
        );
      }),
    );
    const callSub = call.subscribe({
      next: handleSubscribe,
      error: createErrorHandler('useFollow.globalFollow', false, onError),
    });
    return () => callSub.unsubscribe();
  }, []);

  React.useEffect(() => {
    const payload = followingState.isFollowingQuery;
    if (payload) {
      const call = sdk.api.profile.isFollowing({
        follower: payload.followerEthAddress,
        following: payload.followingEthAddress,
      });
      const callSub = call.subscribe({
        next: (resp: {
          data: { isFollowing: boolean; args: { follower: string; following: string } };
        }) => {
          dispatch({
            type: 'IS_FOLLOWING_SUCCESS',
            payload: {
              isFollowing: resp.data.isFollowing,
              followingEthAddress: payload.followingEthAddress,
            },
          });
        },
        error: createErrorHandler('useFollow.isFollowing', false, onError),
      });
      return () => {
        callSub.unsubscribe();
      };
    }
    return;
  }, [followingState.isFollowingQuery]);

  React.useEffect(() => {
    const payload = followingState.isFollowingMultipleQuery;
    if (payload) {
      const getFollowedProfilesCalls: Observable<any>[] = payload.followingEthAddressArray.map(
        (profile: string) => {
          return profileService.isFollowing({
            follower: payload.followerEthAddress,
            following: profile,
          });
        },
      );

      const callSub = forkJoin(getFollowedProfilesCalls).subscribe({
        next: (
          callsResp: {
            data: { isFollowing: boolean; args: { follower: string; following: string } };
          }[],
        ) => {
          const followedProfiles = callsResp
            .filter(resp => resp.data.isFollowing === true)
            .map(resp => resp.data.args.following);
          dispatch({
            type: 'IS_FOLLOWING_MULTIPLE_SUCCESS',
            payload: followedProfiles,
          });
        },
        error: createErrorHandler('useFollow.isFollowing', false, onError),
      });
      return () => {
        callSub.unsubscribe();
      };
    }
    return;
  }, [followingState.isFollowingMultipleQuery]);

  React.useEffect(() => {
    const payload = followingState.followQuery;
    if (payload) {
      const call = profileService.follow({ ethAddress: payload });

      const callSub = call.subscribe({
        next: (resp: { data: { follow: boolean } }) => {
          dispatch({
            type: 'FOLLOW_SUCCESS',
            payload: { followEthAddress: payload, isFollowing: resp.data.follow },
          });
        },
        error: createErrorHandler('useFollow.follow', false, onError),
      });

      dispatch({
        type: 'FOLLOW_SUCCESS',
        payload: { followEthAddress: payload, isFollowing: true },
      });
      return () => {
        callSub.unsubscribe();
      };
    }
    return;
  }, [followingState.followQuery]);

  React.useEffect(() => {
    const payload = followingState.unfollowQuery;
    if (payload) {
      const call = profileService.unFollow({ ethAddress: payload });

      const callSub = call.subscribe({
        next: (resp: { data: { unFollow: boolean } }) => {
          dispatch({
            type: 'UNFOLLOW_SUCCESS',
            payload: { unfollowEthAddress: payload, isUnfollowing: resp.data.unFollow },
          });
        },
        error: createErrorHandler('useFollow.unfollow', false, onError),
      });

      dispatch({
        type: 'UNFOLLOW_SUCCESS',
        payload: { unfollowEthAddress: payload, isUnfollowing: true },
      });
      return () => {
        callSub.unsubscribe();
      };
    }
    return;
  }, [followingState.unfollowQuery]);

  const actions: UseFollowActions = {
    isFollowing(followerEthAddress, followingEthAddress) {
      dispatch({ type: 'IS_FOLLOWING', payload: { followerEthAddress, followingEthAddress } });
    },
    isFollowingMultiple(followerEthAddress, followingEthAddressArray) {
      dispatch({
        type: 'IS_FOLLOWING_MULTIPLE',
        payload: { followerEthAddress, followingEthAddressArray },
      });
    },
    follow(followEthAddress) {
      dispatch({ type: 'FOLLOW', payload: followEthAddress });
    },
    unfollow(unfollowEthAddress) {
      dispatch({ type: 'UNFOLLOW', payload: unfollowEthAddress });
    },
  };

  return [followingState.followedProfiles, actions];
};

export default useFollow;
