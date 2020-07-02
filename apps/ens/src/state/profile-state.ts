import { action, createComponentStore, Action, thunk, Thunk, persist } from 'easy-peasy';
import { forkJoin } from 'rxjs';
import { getEthAddress } from '../services/profile-service';

export interface IStateErrorPayload {
  errorKey: string;
  error: Error;
  critical: boolean;
}

export interface ProfileState {
  loggedEthAddress?: string;
  token: string | null;
  ensAddress: string | null;
  ensChecked: boolean;
  registeringENS: boolean;
  /**
   * whether we are fetching the profile or not
   */
  fetching: boolean;
  errors: {
    // key is the context of the error
    // example {'form.username': new Error('username is taken')}
    [key: string]: {
      error: Error;
      critical: boolean;
    };
  };
}

export interface ProfileStateModel {
  data: ProfileState;
  updateData: Action<ProfileStateModel, Partial<ProfileState>>;
  createError: Action<ProfileStateModel, IStateErrorPayload>;
  getLoggedEthAddress: Thunk<ProfileStateModel>;
  handleLoginSuccess: Action<ProfileStateModel, { ethAddress: string; token: string }>;
  handleLoginError: Action<ProfileStateModel, { error: Error }>;
  checkENSAddress: Thunk<ProfileStateModel, { ethAddress: string }>;
  registerENSAddress: Thunk<
    ProfileStateModel,
    { name: string; providerName: string; ethAddress: string }
  >;
}

export const profileStateModel: ProfileStateModel = {
  data: persist(
    {
      loggedEthAddress: undefined,
      token: null,
      ensAddress: null,
      ensChecked: false,
      registeringENS: false,
      fetching: false,
      errors: {},
    },
    { blacklist: ['fetching', 'errors'] },
  ),
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
  // called when a login is successfull
  // payload should contain ethAddress and token
  handleLoginSuccess: action((state, payload) => {
    state.data = Object.assign(state.data, {
      loggedEthAddress: payload.ethAddress,
      token: payload.token,
      fetching: false,
    });
  }),
  handleLoginError: action((state, payload) => {
    const { error } = payload;
    state.data = Object.assign(state.data, {
      errors: {
        ...state.data.errors,
        Login_Error: {
          error: error,
          critical: false,
        },
      },
    });
  }),
  getLoggedEthAddress: thunk(async (actions, _payload, { injections }) => {
    const { channels, logger } = injections;
    const $stash = channels.commons.cache_service.getStash(null);
    try {
      const call = forkJoin({
        stash: $stash,
      });
      return call.subscribe(async (deps: { stash: any }) => {
        try {
          const ethAddress = await getEthAddress(deps.stash);
          actions.updateData({
            loggedEthAddress: ethAddress,
          });
        } catch (err) {
          logger.error(err);
          actions.createError({
            errorKey: 'actions_getLoggedEthAddress',
            error: err,
            critical: false,
          });
          return;
        }
      });
    } catch (ex) {
      logger.error(ex);
      actions.createError({
        errorKey: 'actions.getLoggedEthAddress',
        error: ex,
        critical: true,
      });
      return;
    }
  }),
  checkENSAddress: thunk(async (actions, payload, { injections }) => {
    const { ethAddress } = payload;
    const { logger } = injections;
    logger.info('Checking ENS for ethAddress: %s', ethAddress);
    actions.updateData({
      ensChecked: true,
      ensAddress: null,
    });
  }),
  registerENSAddress: thunk(async (actions, payload, { injections }) => {
    const { name, providerName, ethAddress } = payload;
    const { logger } = injections;
    actions.updateData({
      registeringENS: true,
    });
    // @TODO: call the actual observable
    Promise.resolve({
      name,
      providerName,
      ethAddress,
    }).then(() => {
      actions.updateData({
        registeringENS: false,
      });
      logger.info('ENS Name: %s, registered', name);
      // if there is an error
      actions.createError({
        errorKey: 'ens.registerError',
        error: new Error('There was an error registering your ens name'),
        critical: false,
      });
    });
  }),
};

export const useProfileState = (channels?: any, logger?: any) =>
  createComponentStore(profileStateModel, {
    name: 'FeedApp-ProfileState',
    injections: { channels, logger },
  })();
