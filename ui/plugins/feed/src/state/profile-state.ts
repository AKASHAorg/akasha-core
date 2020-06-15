import { action, createComponentStore, Action, thunk, Thunk } from 'easy-peasy';
import { forkJoin } from 'rxjs';
import { getEthAddress } from '../services/profile-service';

export interface IStateErrorPayload {
  errorKey: string;
  error: Error;
  critical: boolean;
}

export interface ProfileState {
  loggedEthAddress: string | null;
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
}

export const profileStateModel: ProfileStateModel = {
  data: {
    loggedEthAddress: null,
    fetching: false,
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
          return;
          // // having the eth address is mandatory in this case
          // actions.createError({
          //   errorKey: 'action.getLoggedEthAddress',
          //   error: err,
          //   critical: true,
          // });
        }
      });
    } catch (ex) {
      logger.error(ex);
      return;
      // actions.createError({
      //   errorKey: 'actions.getLoggedEthAddress',
      //   error: ex,
      //   critical: true,
      // });
    }
  }),
};

export const useProfileState = (channels?: any, logger?: any) =>
  createComponentStore(profileStateModel, {
    name: 'FeedApp-ProfileState',
    injections: { channels, logger },
  })();
