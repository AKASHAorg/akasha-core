import { action, thunk, Action, Thunk, createContextStore } from 'easy-peasy';
import { getEthAddress } from '../services/profile-service';
import { race, forkJoin } from 'rxjs';
import { filter, takeLast } from 'rxjs/operators';
import { generateProfileData } from '../services/dummy-data';

export interface IPostalAddress {
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  streetAddress: string;
}

export interface IProfileData {
  avatar?: any;
  name: string;
  description?: string;
  coverImage?: any;
  email?: string;
  url?: string;
  address?: IPostalAddress;
  ethAddress: string;
}

export interface LoggedProfileState {
  profileData: {};
  ethAddress: string | null;
  jwtToken: string | null;
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

export interface LoggedProfileStateModel {
  data: LoggedProfileState;
  updateData: Action<LoggedProfileStateModel, Partial<LoggedProfileState>>;
  createError: Action<LoggedProfileStateModel, IStateErrorPayload>;
  getProfileData: Thunk<LoggedProfileStateModel, string>;
  getEthAddress: Thunk<LoggedProfileStateModel>;
  authorize: Thunk<LoggedProfileStateModel, number>;
}

export const loggedProfileStateModel: LoggedProfileStateModel = {
  data: {
    jwtToken: null,
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
  authorize: thunk(async (actions, ethProvider, { injections }) => {
    const { auth } = injections.channels;
    try {
      const call = auth.authService.signIn(ethProvider);
      // handle the case where signIn was triggered from another place
      const globalCall = injections.globalChannel.pipe(
        filter((response: any) => response.channelInfo.method === 'signIn'),
        takeLast(1),
      );
      race(call, globalCall).subscribe(
        (response: any) => {
          actions.updateData({
            jwtToken: response.data.token,
            ethAddress: response.data.ethAddress,
          });
        },
        (err: Error) => {
          // console.error('action[subscription].authorize', err);
          actions.createError({
            errorKey: 'action[subscription].authorize',
            error: err,
            critical: false,
          });
        },
      );
    } catch (ex) {
      actions.createError({
        errorKey: 'action.authorize',
        error: ex,
        critical: false,
      });
    }
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
let loginState: ReturnType<typeof createContextStore>;
export const getLoggedProfileStore = (channels?: any, globalChannel?: any, logger?: any) => {
  if (loginState) return loginState;
  loginState = createContextStore(loggedProfileStateModel, {
    name: 'AKASHA-app-LoggedProfileState',
    injections: { channels, globalChannel, logger },
  });
  return loginState;
};
