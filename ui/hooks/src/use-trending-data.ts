import * as React from 'react';
import { IAkashaError } from '@akashaproject/ui-awf-typings';
import { combineLatest, Subscription } from 'rxjs';
import { createErrorHandler } from './utils/error-handler';
import { IProfileData } from '@akashaproject/ui-awf-typings/lib/profile';

export interface UseTrendingDataProps {
  sdkModules: { [key: string]: any };
  logger?: any;
  onError: (err: IAkashaError) => void;
}

export interface ITrendingActions {
  /**
   *  get trending tags
   */
  setTrendingTags: (payload: any) => void;
  /**
   *  get trending profiles
   */
  setTrendingProfiles: (payload: any) => void;
}

interface ITrendingState {
  tags: { name: string; totalPosts: number }[];
  profiles: IProfileData[];
}

export type ITrendingAction =
  | { type: 'SET_TRENDING_TAGS_DATA'; payload: any }
  | { type: 'SET_TRENDING_PROFILES_DATA'; payload: any };

const initialTrendingState: ITrendingState = {
  tags: [],
  profiles: [],
};

const trendingStateReducer = (state: ITrendingState, action: ITrendingAction) => {
  switch (action.type) {
    case 'SET_TRENDING_TAGS_DATA':
      return {
        ...state,
        tags: action.payload,
      };

    case 'SET_TRENDING_PROFILES_DATA':
      return {
        ...state,
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
  const { sdkModules, onError } = props;
  const [trendingState, dispatch] = React.useReducer(trendingStateReducer, initialTrendingState);

  React.useEffect(() => {
    const trendingTagsCall = sdkModules.posts.tags.getTrending(null);
    const tagsSub: Subscription | undefined = trendingTagsCall.subscribe({
      next: (resp: any) => {
        if (resp.data.searchTags) {
          actions.setTrendingTags(resp.data.searchTags);
        }
      },
      error: createErrorHandler('useTrendingData.getTrendingTags', false, onError),
    });

    const ipfsGatewayCall = sdkModules.commons.ipfsService.getSettings(null);
    const trendingProfilesCall = sdkModules.profiles.profileService.getTrending(null);
    const getTrendingProfiles = combineLatest({
      ipfsGatewayCall: ipfsGatewayCall,
      trendingProfilesCall: trendingProfilesCall,
    });
    const profilesSub: Subscription | undefined = getTrendingProfiles.subscribe({
      next: (resp: any) => {
        const ipfsGateway = resp.ipfsGatewayCall.data;
        if (resp.trendingProfilesCall.data.searchProfiles) {
          const profiles = resp.trendingProfilesCall.data.searchProfiles.map((profile: any) => {
            const profileData = Object.assign({}, profile);
            if (profile.avatar && !profile.avatar.startsWith(ipfsGateway)) {
              const profileAvatarWithGateway = `${ipfsGateway}/${profile.avatar}`;
              profileData.avatar = profileAvatarWithGateway;
            }
            // should replace with real data once we integrate follow functionality
            profileData.followers = profileData.followers || 0;
            return profileData;
          });
          actions.setTrendingProfiles(profiles);
        }
      },
      error: createErrorHandler('useTrendingData.getTrendingProfiles', false, onError),
    });
    return () => {
      if (tagsSub) {
        tagsSub.unsubscribe();
      }
      if (profilesSub) {
        profilesSub.unsubscribe();
      }
    };
  }, []);

  const actions: ITrendingActions = {
    setTrendingTags: (tagsData: any) => {
      dispatch({ type: 'SET_TRENDING_TAGS_DATA', payload: tagsData });
    },
    setTrendingProfiles: (profilesData: any) => {
      dispatch({ type: 'SET_TRENDING_PROFILES_DATA', payload: profilesData });
    },
  };

  return [trendingState, actions];
};

export default useTrendingData;
