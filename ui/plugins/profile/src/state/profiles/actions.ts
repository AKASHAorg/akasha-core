import { Dispatch } from 'react';
import { IAction, ValueOf } from '../interfaces';
import { actionTypes } from './action-types';
import {
  IGetAppsPayload,
  IGetMoreAppsPayload,
  IGetMoreProfilesPayload,
  IGetProfilesPayload,
  IGetLoggedProfilePayload,
  IGetProfileFollowersPayload,
  IGetProfileFollowingsPayload,
} from './interfaces';

export const getProfilesActions = (
  dispatch: Dispatch<IAction<any, ValueOf<typeof actionTypes>>>,
) => ({
  getLoggedProfile: (payload: IGetLoggedProfilePayload) =>
    dispatch({ type: actionTypes.GET_LOGGED_PROFILE, payload }),
  getProfiles: (payload: IGetProfilesPayload) =>
    dispatch({ type: actionTypes.GET_PROFILES, payload }),
  getProfileFollowers: (payload: IGetProfileFollowersPayload) =>
    dispatch({ type: actionTypes.GET_PROFILE_FOLLOWERS, payload }),
  getProfileFollowings: (payload: IGetProfileFollowingsPayload) =>
    dispatch({ type: actionTypes.GET_PROFILE_FOLLOWINGS, payload }),
  getMoreProfiles: (payload: IGetMoreProfilesPayload) =>
    dispatch({ type: actionTypes.GET_MORE_PROFILES, payload }),
  getApps: (payload: IGetAppsPayload) => dispatch({ type: actionTypes.GET_APPS, payload }),
  getMoreApps: (payload: IGetMoreAppsPayload) =>
    dispatch({ type: actionTypes.GET_MORE_APPS, payload }),
});
