import { action, thunk, createComponentStore, Action, Thunk } from 'easy-peasy';
import { IProfileData } from './logged-profile-state';

export interface IRawProfileData {
  name?: string;
  image?: string;
  coverPhoto?: string;
  description?: string;
}

export interface PostsState {
  profileData: IProfileData;
  ethAddress: string | null;
  loggedEthAddress?: string | null;
  // when we are loading the profile data
  isLoading?: boolean;
  errors: {
    // key is the context of the error
    // example {'form.username': new Error('username is taken')}
    [key: string]: {
      error: Error;
      critical: boolean;
    };
  };
}

export interface IStateErrorPayload {
  errorKey: string;
  error: Error;
  critical: boolean;
}

export interface PostsStateModel {
  data: PostsState;
  updateData: Action<PostsStateModel, Partial<PostsState>>;
  createError: Action<PostsStateModel, IStateErrorPayload>;
  getProfileData: Thunk<PostsStateModel, string>;
}

export const postsState: PostsStateModel = {
  data: {
    ethAddress: null,
    profileData: {
      name: '',
      avatar: { src: '', prefix: '', isUrl: false },
      coverImage: { src: '', prefix: '', isUrl: false },
      description: '',
    },
    isLoading: undefined,
    errors: {},
  },
  updateData: action((state, payload) => {
    state.data = Object.assign({}, state.data, payload);
  }),
  // add errors to store, merging them with old ones
  createError: action((state, payload) => {
    state.data = Object.assign({}, state.data, {
      errors: {
        ...state.data.errors,
        [payload.errorKey]: {
          error: payload.error,
          critical: payload.critical,
        },
      },
    });
  }),

  getProfileData: thunk(async (_actions, _ethAddress) => {
    return null;
  }),
};

export const usePostsState = (channels?: any, globalChannel?: any, logger?: any) =>
  createComponentStore(postsState, {
    name: 'AKASHA-PostsState',
    injections: { channels, globalChannel, logger },
  })();
