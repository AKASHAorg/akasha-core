import { action, Action, createContextStore, persist, Thunk, thunk } from 'easy-peasy';
import { getEthAddress } from '../services/profile-service';
import { race, forkJoin, concat } from 'rxjs';
import { filter, takeLast } from 'rxjs/operators';

export interface IStateErrorPayload {
  errorKey: string;
  error: Error;
  critical: boolean;
}

export interface IRegistrationStatus {
  registering: boolean;
  isAvailable: boolean;
  checking: boolean;
  name: string;
  claiming: boolean;
}

export interface ProfileState {
  loggedEthAddress?: string;
  token: string | null;
  ensInfo: { name?: string; providerName?: string };
  registrationStatus: null | IRegistrationStatus;
  statusReceived: boolean;
  ensChecked: boolean;
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
  getENSByAddress: Thunk<ProfileStateModel, { ethAddress: string }>;
  getEnsRegistrationStatus: Thunk<ProfileStateModel, { ethAddress: string }>;
  registerENS: Thunk<ProfileStateModel, { name: string; providerName: string; ethAddress: string }>;
  authorize: Thunk<ProfileStateModel, number>;
  checkENSAvailable: Thunk<ProfileStateModel, IRegistrationStatus>;
  claimENS: Thunk<ProfileStateModel, IRegistrationStatus & { ethAddress: string }>;
}

const ENS_REGISTRATION_STATUS = 'ens-registration-status';

export const profileStateModel: ProfileStateModel = persist(
  {
    loggedEthAddress: undefined,
    token: null,
    ensInfo: {},
    registrationStatus: null,
    statusReceived: false,
    ensChecked: false,
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
    getENSByAddress: thunk(async (actions, payload, { injections }) => {
      const { ethAddress } = payload;
      const { channels, logger } = injections;
      const checkEns = channels.registry.ens.resolveAddress({ ethAddress });
      actions.updateData({
        fetching: true,
      });
      checkEns.subscribe((response: { data: any }) => {
        logger.info('getENSByAddress response: %j', response.data);
        actions.updateData({
          ensChecked: true,
          ensInfo: response.data ? { name: response.data, providerName: 'AKASHA ENS' } : {},
          fetching: false,
        });
      });
    }),
    getEnsRegistrationStatus: thunk(async (actions, payload, { injections }) => {
      const { channels } = injections;
      const call = channels.db.settingsAttachment.get({
        id: ENS_REGISTRATION_STATUS,
        ethAddress: payload.ethAddress,
      });
      call.subscribe((resp: any) => {
        actions.updateData({
          registrationStatus: JSON.parse(resp.data),
          statusReceived: true,
        });
      });
    }),
    registerENS: thunk(async (actions, payload, { injections }) => {
      const { name, ethAddress } = payload;
      const { logger, channels } = injections;
      const registrationStatus = {
        name,
        registering: true,
        isAvailable: true,
        checking: false,
        claiming: false,
      };
      actions.updateData({
        registrationStatus,
        ensInfo: {
          name,
        },
      });
      const saveToDb = channels.db.settingsAttachment.put({
        ethAddress,
        obj: {
          data: JSON.stringify(registrationStatus),
          type: 'string',
          id: ENS_REGISTRATION_STATUS,
        },
      });
      const removeFromDb = channels.db.settingsAttachment.deleteSettings({
        ethAddress,
        id: ENS_REGISTRATION_STATUS,
      });
      const register = channels.registry.ens.registerName({ name });
      concat(saveToDb, register, removeFromDb).subscribe(() => {
        actions.updateData({
          registrationStatus: null,
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
    checkENSAvailable: thunk((actions, payload, { injections }) => {
      const { channels, logger } = injections;
      actions.updateData({
        registrationStatus: {
          ...payload,
          checking: true,
        },
      });
      const channel = channels.registry.ens.isAvailable({ name: payload.name });

      channel.subscribe((response: any) => {
        logger.info('Name: %s is available: %s', payload.name, response.data);
        actions.updateData({
          registrationStatus: {
            ...payload,
            checking: false,
            isAvailable: response.data,
          },
        });
      });
    }),
    claimENS: thunk(async (actions, payload, { injections }) => {
      const { channels, logger } = injections;
      const { name, ethAddress, ...other } = payload;

      const claim = channels.registry.ens.claimName({ name });
      const removeFromDb = channels.db.settingsAttachment.deleteSettings({
        ethAddress,
        id: ENS_REGISTRATION_STATUS,
      });
      actions.updateData({
        registrationStatus: {
          name,
          ...other,
          claiming: true,
        },
      });
      concat(claim, removeFromDb).subscribe(() => {
        logger.log('Claim response successful');
        actions.updateData({
          registrationStatus: null,
          ensInfo: {
            name: name,
            providerName: 'AKASHA ENS',
          },
        });
      });
    }),
  },
  { blacklist: ['fetching', 'errors', 'ensInfo', 'ensChecked', 'statusReceived'] },
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
