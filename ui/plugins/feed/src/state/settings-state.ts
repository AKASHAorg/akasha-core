import { action, createComponentStore, Action, thunk, Thunk } from 'easy-peasy';

export interface IStateErrorPayload {
  errorKey: string;
  error: Error;
  critical: boolean;
}
export interface IFeedAppSettings {
  ipfsGateway: string | null;
}
export interface SettingsState {
  settings: IFeedAppSettings | {};
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

export interface SettingsStateModel {
  data: SettingsState;
  updateData: Action<SettingsStateModel, Partial<SettingsState>>;
  createError: Action<SettingsStateModel, IStateErrorPayload>;
  getSettings: Thunk<SettingsStateModel>;
}

export const settingsStateModel: SettingsStateModel = {
  data: {
    settings: {},
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
  getSettings: thunk(async (_actions, _payload, { injections }) => {
    console.log(injections, 'injections');
  }),
};

export const useSettingsState = (channels?: any, logger?: any) =>
  createComponentStore(settingsStateModel, {
    name: 'FeedApp-ProfileState',
    injections: { channels, logger },
  })();
