import { action, thunk, createComponentStore, Action, Thunk } from 'easy-peasy';
import { getEthAddress } from '../services/profile-service';
import { forkJoin } from 'rxjs';
import { generateProfileData } from '../services/dummy-data';

export interface IProfileData {}

export interface LoggedProfileState {
  profileData: IProfileData;
  ethAddress: string | null;
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
  data: LoggedProfileState;
  updateData: Action<PostsStateModel, Partial<LoggedProfileState>>;
  createError: Action<PostsStateModel, IStateErrorPayload>;
  getProfileData: Thunk<PostsStateModel, string>;
  getEthAddress: Thunk<PostsStateModel>;
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

  getProfileData: thunk(async (actions, ethAddress) => {
    try {
      const profileData = await generateProfileData(ethAddress);
      actions.updateData({ profileData });
    } catch (ex) {
      return actions.createError({
        errorKey: '[loggedProfileState]: actions.getProfileData',
        error: ex,
        critical: true,
      });
    }
  }),

  getEthAddress: thunk(async (actions, _notPassed, { injections }) => {
    const { channels, logger } = injections;
    const $stash = channels.commons.cacheService.getStash(null);
    const $web3Instance = channels.commons.web3Service.web3(null);
    try {
      const call = forkJoin({
        stash: $stash,
        web3Instance: $web3Instance,
      });
      return call.subscribe(async (deps: { stash: any; web3Instance: any }) => {
        try {
          const ethAddress = await getEthAddress(deps.stash.data, deps.web3Instance.data);
          actions.updateData({
            ethAddress,
          });
        } catch (err) {
          logger.error(err);
          // having the eth address is mandatory in this case
          actions.createError({
            errorKey: 'action.getLoggedEthAddress',
            error: err,
            critical: true,
          });
        }
      });
    } catch (ex) {
      logger.error(ex);
      return actions.createError({
        errorKey: 'actions.getLoggedEthAddress',
        error: ex,
        critical: true,
      });
    }
  }),
};

export const useLoggedProfileState = (channels?: any, globalChannel?: any, logger?: any) =>
  createComponentStore(postsState, {
    name: 'AKASHA-LoggedProfileState',
    injections: { channels, globalChannel, logger },
  })();
