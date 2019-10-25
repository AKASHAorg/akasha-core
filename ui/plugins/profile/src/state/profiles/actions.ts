import { Dispatch } from 'react';
import { IAction, ValueOf } from '../interfaces';
import { actionTypes } from './action-types';
import {
  IGetAppsPayload,
  IGetMoreAppsPayload,
  IGetMoreProfilesPayload,
  IGetProfilesPayload,
} from './interfaces';

export const getProfilesActions = (
  dispatch: Dispatch<IAction<any, ValueOf<typeof actionTypes>>>,
) => ({
  getProfiles: (payload: IGetProfilesPayload) =>
    dispatch({ type: actionTypes.GET_PROFILES, payload }),
  getMoreProfiles: (payload: IGetMoreProfilesPayload) =>
    dispatch({ type: actionTypes.GET_MORE_PROFILES, payload }),
  getApps: (payload: IGetAppsPayload) => dispatch({ type: actionTypes.GET_APPS, payload }),
  getMoreApps: (payload: IGetMoreAppsPayload) =>
    dispatch({ type: actionTypes.GET_MORE_APPS, payload }),
});
