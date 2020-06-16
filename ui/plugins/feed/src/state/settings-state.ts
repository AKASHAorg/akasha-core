import { action, createComponentStore, Action, thunk, Thunk } from 'easy-peasy';

const FEED_APP_SETTINGS_ID = 'FEEDAPP_SETTINGS_ID';

export interface IStateErrorPayload {
  errorKey: string;
  error: Error;
  critical: boolean;
}
export interface IFeedAppSettings {
  ipfsGateway: string;
}
export interface SettingsState {
  settings: IFeedAppSettings;
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
  getSettings: Thunk<SettingsStateModel, { ethAddress: string }>;
}

export const settingsStateModel: SettingsStateModel = {
  data: {
    settings: {
      ipfsGateway: '//cloudflare-ipfs.com/ipfs/',
    },
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
  getSettings: thunk(async (actions, payload, { injections }) => {
    const { ethAddress } = payload;
    const { channels } = injections;
    const call = channels.db.settingsAttachment.get({
      ethAddress,
      id: FEED_APP_SETTINGS_ID,
    });
    call.subscribe((resp: { channelInfo: any; data: string }) => {
      const { data } = resp;
      if (data) {
        actions.updateData({ settings: JSON.parse(data) });
      }
      actions.updateData({ fetching: false });
    });
  }),
};

export const useSettingsState = (channels?: any, logger?: any) =>
  createComponentStore(settingsStateModel, {
    name: 'FeedApp-ProfileState',
    injections: { channels, logger },
  })();
