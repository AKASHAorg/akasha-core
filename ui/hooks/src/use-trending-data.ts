import * as React from 'react';
import { IAkashaError } from '@akashaproject/ui-awf-typings';
import getSDK from '@akashaproject/awf-sdk';
import { createErrorHandler } from './utils/error-handler';
import { IProfileData } from '@akashaproject/ui-awf-typings/lib/profile';

export interface UseTrendingDataProps {
  onError: (err: IAkashaError) => void;
}

export interface ITrendingActions {
  /**
   *  get trending tags
   */
  getTrendingTags: () => void;
  /**
   *  get trending profiles
   */
  getTrendingProfiles: () => void;
}

interface ITrendingState {
  tags: { name: string; totalPosts: number }[];
  profiles: IProfileData[];
  // reducer related
  getTagsQuery: boolean;
  getProfilesQuery: boolean;
}

export type ITrendingAction =
  | { type: 'GET_TRENDING_TAGS' }
  | { type: 'GET_TRENDING_TAGS_SUCCESS'; payload: { name: string; totalPosts: number }[] }
  | { type: 'GET_TRENDING_PROFILES' }
  | { type: 'GET_TRENDING_PROFILES_SUCCESS'; payload: IProfileData[] };

const initialTrendingState: ITrendingState = {
  tags: [],
  profiles: [],
  getTagsQuery: false,
  getProfilesQuery: false,
};

const trendingStateReducer = (state: ITrendingState, action: ITrendingAction) => {
  switch (action.type) {
    case 'GET_TRENDING_TAGS':
      return {
        ...state,
        getTagsQuery: true,
      };
    case 'GET_TRENDING_TAGS_SUCCESS':
      return {
        ...state,
        getTagsQuery: false,
        tags: action.payload,
      };

    case 'GET_TRENDING_PROFILES':
      return {
        ...state,
        getProfilesQuery: true,
      };

    case 'GET_TRENDING_PROFILES_SUCCESS':
      return {
        ...state,
        getProfilesQuery: false,
        profiles: action.payload,
      };

    default:
      throw new Error('[UseTrendingDataReducer] action is not defined!');
  }
};

const useTrendingData = (
  props: UseTrendingDataProps,
): [
  { tags: { name: string; totalPosts: number }[]; profiles: IProfileData[] },
  ITrendingActions,
] => {
  const { onError } = props;

  const sdk = getSDK();

  const [trendingState, dispatch] = React.useReducer(trendingStateReducer, initialTrendingState);

  React.useEffect(() => {
    actions.getTrendingTags();
    actions.getTrendingProfiles();
  }, []);

  React.useEffect(() => {
    if (trendingState.getTagsQuery) {
      const trendingTagsCall = sdk.api.tags.getTrending();
      const tagsSub = trendingTagsCall.subscribe({
        next: resp => {
          if (resp.data.searchTags) {
            dispatch({ type: 'GET_TRENDING_TAGS_SUCCESS', payload: resp.data.searchTags });
          }
        },
        error: createErrorHandler('useTrendingData.getTrendingTags', false, onError),
      });
      return () => tagsSub?.unsubscribe();
    }
    return;
  }, [trendingState.getTagsQuery]);

  React.useEffect(() => {
    if (trendingState.getProfilesQuery) {
      const ipfsGateway = sdk.services.common.ipfs.getSettings().gateway;
      const trendingProfilesCall = sdk.api.profile.getTrending();

      const profilesSub = trendingProfilesCall.subscribe({
        next: resp => {
          if (resp.data.searchProfiles) {
            const profiles = resp.data.searchProfiles.map(profile => {
              const profileData = Object.assign({}, profile);
              if (profile.avatar && !profile.avatar.startsWith(ipfsGateway)) {
                const profileAvatarWithGateway = `${ipfsGateway}/${profile.avatar}`;
                profileData.avatar = profileAvatarWithGateway;
              }
              // should replace with real data once we integrate follow functionality
              profileData.totalFollowers = profileData.totalFollowers || 0;
              return profileData;
            });
            dispatch({ type: 'GET_TRENDING_PROFILES_SUCCESS', payload: profiles });
          }
        },
        error: createErrorHandler('useTrendingData.getTrendingProfiles', false, onError),
      });
      return () => profilesSub.unsubscribe();
    }
    return;
  }, [trendingState.getProfilesQuery]);

  const actions: ITrendingActions = {
    getTrendingTags: () => {
      dispatch({ type: 'GET_TRENDING_TAGS' });
    },
    getTrendingProfiles: () => {
      dispatch({ type: 'GET_TRENDING_PROFILES' });
    },
  };

  return [trendingState, actions];
};

export default useTrendingData;
