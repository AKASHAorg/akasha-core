import React from 'react';
import { createContainer } from 'react-tracked';
import { handleActions } from './handle-actions';
import { IAction } from './interfaces';

interface IUserProfile {
  username: string;
  name: string;
}
export interface IProfileState {
  profiles: IUserProfile[];
  loggedProfile: IUserProfile | null;
  profiles_cursor: {};
}

export type ProfileAction = IAction<any, keyof typeof actionTypes>;

export type IProfileReducer = (state: IProfileState, action: ProfileAction) => any;

export const profileState: IProfileState = {
  profiles: [],
  loggedProfile: null,
  profiles_cursor: {
    prev: '',
    next: '',
  },
};

export const actionTypes = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  SET_PROFILES: 'SET_PROFILES',
  CHANGE_PROFILE_DATA: 'CHANGE_PROFILE_DATA',
};

export function profileInit(initialValues?: IProfileState): IProfileState {
  return {
    ...profileState,
    ...initialValues,
  };
}

export const profileReducer: IProfileReducer = handleActions<
  typeof actionTypes,
  IProfileState,
  any
>(
  {
    LOGIN: (draft, payload) => {
      draft.loggedProfile = payload;
      return draft;
    },
    LOGOUT: draft => {
      draft.loggedProfile = null;
      return draft;
    },
    SET_PROFILES: (draft, payload) => {
      draft.profiles = draft.profiles.concat(payload);
      return draft;
    },
    CHANGE_PROFILE_DATA: (draft, payload) => {
      draft.loggedProfile = payload;
      return draft;
    },
  },
  profileState,
);

const useValue = ({
  reducer,
  initialState,
}: {
  reducer: IProfileReducer;
  initialState: IProfileState;
}): [IProfileState, React.Dispatch<ProfileAction>] => React.useReducer(reducer, initialState);

export const {
  Provider: ProfileProvider,
  useTracked: useProfile,
  useTrackedState: useProfileState,
  useUpdate: useProfileUpdate,
  useSelector: useProfileSelector,
} = createContainer(useValue);
