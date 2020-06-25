import { action, createComponentStore, Action, thunk, Thunk } from 'easy-peasy';
import { getDefaultSettings } from '../services/settings-service';

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
  saveSettings: Thunk<
    SettingsStateModel,
    { ethAddress: string; settings: { ipfsGateway: string } }
  >;
  resetToDefaults: Thunk<SettingsStateModel, { ethAddress: string }>;
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
    const { channels, logger } = injections;
    actions.updateData({
      fetching: true,
    });
    try {
      const call = channels.db.settingsAttachment.get({
        ethAddress,
        id: FEED_APP_SETTINGS_ID,
      });
      call.subscribe((resp: { channelInfo: any; data: string }) => {
        const { data } = resp;
        if (data) {
          return actions.updateData({ settings: JSON.parse(data), fetching: false });
        }
        return actions.updateData({ fetching: false });
      });
    } catch (ex) {
      logger.error('Error in settings-state.ts/getSettings: %j', ex);
      actions.createError({
        errorKey: 'actions_getSettings',
        error: ex,
        critical: true,
      });
    }
  }),
  saveSettings: thunk(async (actions, payload, { injections }) => {
    const { ethAddress, settings } = payload;
    const { channels, logger } = injections;
    try {
      const call = channels.db.settingsAttachment.put({
        ethAddress,
        obj: {
          data: JSON.stringify(settings),
          type: 'string',
          id: FEED_APP_SETTINGS_ID,
        },
      });
      call.subscribe(async (resp: any) => {
        const attachment = await resp.data.doc.getAttachment(FEED_APP_SETTINGS_ID);
        const textObj = await attachment.getStringData();
        actions.updateData({
          settings: JSON.parse(textObj),
        });
      });
    } catch (ex) {
      logger.error('Error in settings-state.ts/saveSettings: %j', ex);
      actions.createError({
        errorKey: 'actions.saveSettings',
        error: ex,
        critical: false,
      });
    }
  }),
  resetToDefaults: thunk(async (actions, payload, { injections }) => {
    const { ethAddress } = payload;
    const { channels, logger } = injections;
    try {
      const call = channels.db.settingsAttachment.deleteSettings({
        ethAddress,
        id: FEED_APP_SETTINGS_ID,
      });
      call.subscribe(async () => {
        const defaultSettings = await getDefaultSettings();
        actions.updateData({
          settings: defaultSettings,
        });
      });
    } catch (ex) {
      logger.error('Error in settings-state.ts/resetToDefaults: %j', ex);
      actions.createError({
        errorKey: 'actions.resetToDefaults',
        error: ex,
        critical: false,
      });
    }
  }),
};

export const useSettingsState = (channels?: any, logger?: any) =>
  createComponentStore(settingsStateModel, {
    name: 'FeedApp-ProfileState',
    injections: { channels, logger },
  })();
