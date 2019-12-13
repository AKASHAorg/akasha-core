import { Reducer, useReducer } from 'react';
import { createContainer } from 'react-tracked';
import { handleActions } from '../handle-actions';
import { IAction, UseValueType } from '../interfaces';
import { actionTypes } from './action-types';
import { getProfilesActions, IProfileActions } from './actions';
import {
  IChangeAppsFilter,
  IChangeProfilesFilter,
  IGetAppsPayload,
  IGetMoreAppsPayload,
  IGetMoreProfilesPayload,
  IProfileState,
  IGetLoggedProfilePayload,
  IGetProfileFollowersPayload,
  IGetProfileFollowingsPayload,
  IProfile,
  IFeed,
} from './interfaces';

export const profileState: IProfileState = {
  profiles: [],
  followers: [],
  followings: [],
  apps: [],
  feeds: [],
  feedItems: [],
};

export function profileInit(initialValues?: Partial<IProfileState>): IProfileState {
  return {
    ...profileState,
    ...initialValues,
  };
}

type ProfileReducer = Reducer<IProfileState, IAction<any, keyof typeof actionTypes>>;

export const profileReducer: ProfileReducer = handleActions<typeof actionTypes, IProfileState, any>(
  {
    GET_LOGGED_PROFILE: (draft, payload: IGetLoggedProfilePayload) => {
      draft.loggedProfile = payload.loggedProfile;
      return draft;
    },
    GET_PROFILES: (draft, payload: { profiles: IProfile[] }) => {
      draft.profiles = draft.profiles.concat(payload.profiles);
      return draft;
    },
    GET_PROFILE_FOLLOWERS: (draft, payload: IGetProfileFollowersPayload) => {
      draft.followers = draft.followers.concat(payload);
      return draft;
    },
    GET_PROFILE_FOLLOWINGS: (draft, payload: IGetProfileFollowingsPayload) => {
      draft.followings = draft.followings.concat(payload);
      return draft;
    },
    GET_MORE_PROFILES: (draft, payload: IGetMoreProfilesPayload) => {
      draft.profiles = draft.profiles.concat(payload.profiles);
      return draft;
    },
    GET_PROFILE_FEED: (draft, payload: { feed: IFeed }) => {
      const feedIdx = draft.feeds.findIndex(f => f.profileId === payload.feed.profileId);
      if (feedIdx < 0) {
        draft.feeds.push(payload.feed);
      } else {
        draft.feeds[feedIdx].items = draft.feeds[feedIdx].items.concat(payload.feed.items);
      }
      return draft;
    },
    GET_FEED_ITEM_DATA: (draft, payload: any) => {
      draft.feedItems = draft.feedItems.concat(payload);
      return draft;
    },
    GET_APPS: (draft, payload: IGetAppsPayload) => {
      draft.apps = draft.apps.concat(payload.apps);
      return draft;
    },
    GET_MORE_APPS: (draft, payload: IGetMoreAppsPayload) => {
      draft.apps = draft.apps.concat(payload.apps);
      return draft;
    },
    CHANGE_PROFILES_FILTER: (draft, payload: IChangeProfilesFilter) => {
      draft.activeProfilesFilter = payload.filter;
      return draft;
    },
    CHANGE_APPS_FILTER: (draft, payload: IChangeAppsFilter) => {
      draft.activeAppsFilter = payload.filter;
      return draft;
    },
    // test same action in different reducers..
    CLEANUP: () => profileState,
  },
  profileState,
);

const useValue: UseValueType<any, IProfileState, IProfileActions> = () => {
  const [state, dispatch] = useReducer(profileReducer, profileState);
  const actions = getProfilesActions(dispatch);
  return [state, actions];
};

export const {
  Provider: ProfileProvider,
  useTracked: useProfile,
  useTrackedState: useProfileState,
  useUpdate: useProfileUpdate,
  useSelector: useProfileSelector,
} = createContainer(useValue);
