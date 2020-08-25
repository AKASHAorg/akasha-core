import { action, Action, createContextStore, persist, Thunk, thunk } from 'easy-peasy';
import { getEthAddress } from '../services/profile-service';
import { race, forkJoin } from 'rxjs';
import { filter, takeLast } from 'rxjs/operators';

export interface IStateErrorPayload {
  errorKey: string;
  error: Error;
  critical: boolean;
}

export interface ProfileState {
  loggedEthAddress?: string;
  token: string | null;
  ensInfo: { name?: string; providerName?: string };
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

export interface ProfileStateModel extends ProfileState {
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
  authorize: Thunk<ProfileStateModel, number>;
}

export const profileStateModel: ProfileStateModel = persist(
  {
    loggedEthAddress: undefined,
    token: null,
    ensInfo: {},
    ensChecked: false,
    registeringENS: false,
    fetching: false,
    errors: {},
    updateData: action((state, payload) => {
      Object.keys(payload).forEach(key => {
        state[key] = payload[key];
      });
    }),
    // add errors to store, merging them with old ones
    createError: action((state, payload) => {
      state.errors = {
        ...state.errors,
        [payload.errorKey]: {
          error: payload.error,
          critical: payload.critical,
        },
      };
    }),
    // called when a login is successfull
    // payload should contain ethAddress and token
    handleLoginSuccess: action((state, payload) => {
      state.loggedEthAddress = payload.ethAddress;
      state.token = payload.token;
      state.fetching = false;
    }),
    handleLoginError: action((state, payload) => {
      const { error } = payload;
      state.errors = {
        ...state.errors,
        Login_Error: {
          error: error,
          critical: false,
        },
      };
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
      const { logger, channels } = injections;
      logger.info('Checking ENS for ethAddress: %s', ethAddress);
      const checkEns = channels.registry.ens.resolveAddress({ ethAddress });
      checkEns.subscribe((response: { data: any }) => {
        actions.updateData({
          ensChecked: true,
          ensInfo: response.data ? { name: response.data, providerName: 'AKASHA ENS' } : {},
        });
      });
    }),
    registerENSAddress: thunk(async (actions, payload, { injections }) => {
      const { name } = payload;
      const { logger, channels } = injections;

      actions.updateData({
        registeringENS: true,
      });

      const register = channels.registry.ens.registerName({ name });

      register.subscribe(() => {
        actions.updateData({
          registeringENS: false,
          ensInfo: {
            name: name,
            providerName: 'AKASHA ENS',
          },
        });
        logger.info('ENS Name: %s, registered', name);
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
              token: response.data.token,
              loggedEthAddress: response.data.ethAddress,
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
  },
  { blacklist: ['fetching', 'errors', 'ensInfo', 'ensChecked', 'registeringENS'] },
);

let profileState: ReturnType<typeof createContextStore>;
export const getProfileStore = (channels?: any, globalChannel?: any, logger?: any) => {
  if (profileState) return profileState;
  profileState = createContextStore(profileStateModel, {
    name: 'ENSApp-ProfileState',
    injections: { channels, globalChannel, logger },
  });
  return profileState;
};
