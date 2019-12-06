import { Dispatch } from 'react';
import { IAction, ValueOf, IBaseSuspenseAction } from '../interfaces';
import { actionTypes } from './action-types';
import { createSuspenseAction } from '../suspense-action';
import {
  fetchLoggedProfile,
  fetchProfileData,
  fetchProfileFollowers,
  fetchProfileFollowings,
  fetchProfileFeed,
  fetchFeedItemData,
} from '../../services/profile-service';
import { fetchApps } from '../../services/app-service';


export interface IProfileActions {
  getLoggedProfile: IBaseSuspenseAction<null>;
  getProfilesData: IBaseSuspenseAction<any>;
  getProfileFollowers: IBaseSuspenseAction<any>;
  getProfileFollowings: IBaseSuspenseAction<any>;
  getMoreProfiles: IBaseSuspenseAction<any>;
  getApps: IBaseSuspenseAction<any>;
  getMoreApps: IBaseSuspenseAction<any>;
  getProfileFeed: IBaseSuspenseAction<any>;
  getFeedItemData: IBaseSuspenseAction<any>;
}

export const getProfilesActions = (
  dispatch: Dispatch<IAction<any, ValueOf<typeof actionTypes>>>,
): IProfileActions => ({
  getLoggedProfile: () =>
    createSuspenseAction(dispatch, fetchLoggedProfile, { type: actionTypes.GET_LOGGED_PROFILE }),

  getProfilesData: (payload) =>
    createSuspenseAction(dispatch, fetchProfileData, { type: actionTypes.GET_PROFILES, payload }),

  getProfileFollowers: (payload) =>
    createSuspenseAction(dispatch, fetchProfileFollowers, {
      type: actionTypes.GET_PROFILE_FOLLOWERS,
      payload,
    }),

  getProfileFollowings: (payload) =>
    createSuspenseAction(dispatch, fetchProfileFollowings, {
      type: actionTypes.GET_PROFILE_FOLLOWINGS,
      payload,
    }),

  getMoreProfiles: (payload) =>
    createSuspenseAction(dispatch, fetchProfileData, {
      type: actionTypes.GET_MORE_PROFILES,
      payload,
    }),

  getApps: (payload) =>
    createSuspenseAction(dispatch, fetchApps, { type: actionTypes.GET_APPS, payload }),

  getMoreApps: (payload) =>
    createSuspenseAction(dispatch, fetchApps, { type: actionTypes.GET_MORE_APPS, payload }),

  getProfileFeed: (payload) =>
    createSuspenseAction(dispatch, fetchProfileFeed, {
      type: actionTypes.GET_PROFILE_FEED,
      payload,
    }),

  getFeedItemData: (payload) =>
    createSuspenseAction(dispatch, fetchFeedItemData, {
      type: actionTypes.GET_FEED_ITEM_DATA,
      payload,
    }),
});
