import { Dispatch } from 'react';
import { IAction, ValueOf } from '../interfaces';
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

export const getProfilesActions = (
  dispatch: Dispatch<IAction<any, ValueOf<typeof actionTypes>>>,
) => ({
  getLoggedProfile: () =>
    createSuspenseAction(dispatch, fetchLoggedProfile, { type: actionTypes.GET_LOGGED_PROFILE }),

  getProfilesData: (payload: any) =>
    createSuspenseAction(dispatch, fetchProfileData, { type: actionTypes.GET_PROFILES, payload }),

  getProfileFollowers: (payload: any) =>
    createSuspenseAction(dispatch, fetchProfileFollowers, {
      type: actionTypes.GET_PROFILE_FOLLOWERS,
      payload,
    }),

  getProfileFollowings: (payload: any) =>
    createSuspenseAction(dispatch, fetchProfileFollowings, {
      type: actionTypes.GET_PROFILE_FOLLOWINGS,
      payload,
    }),

  getMoreProfiles: (payload: any) =>
    createSuspenseAction(dispatch, fetchProfileData, {
      type: actionTypes.GET_MORE_PROFILES,
      payload,
    }),

  getApps: (payload: any) =>
    createSuspenseAction(dispatch, fetchApps, { type: actionTypes.GET_APPS, payload }),

  getMoreApps: (payload: any) =>
    createSuspenseAction(dispatch, fetchApps, { type: actionTypes.GET_MORE_APPS, payload }),

  getProfileFeed: (payload: any) =>
    createSuspenseAction(dispatch, fetchProfileFeed, {
      type: actionTypes.GET_PROFILE_FEED,
      payload,
    }),

  getFeedItemData: (payload: any) =>
    createSuspenseAction(dispatch, fetchFeedItemData, {
      type: actionTypes.GET_FEED_ITEM_DATA,
      payload,
    }),
});
