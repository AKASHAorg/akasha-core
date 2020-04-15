import { action, thunk, createComponentStore, persist, Action, Thunk } from 'easy-peasy';
import {
  authenticateBox,
  getProfile,
  updateBoxData,
  getEthAddress,
  getDefaultBoxSettings,
} from '../services/box';

import { getImageProperty } from '../utils/get-image-src';

export interface DataBox {
  name?: string;
  image?: string;
  coverPhoto?: string;
  description?: string;
}
export interface BoxSettings {
  pinningNode: string;
  addressServer: string;
}
export interface ProfileState {
  profileData: DataBox;
  ethAddress: string | null;
  // when user agrees to open the box (signature)
  openBoxConsent: boolean;
  // when user agrees to open the space (signature)
  openSpaceConsent: boolean;
  // when we are loading the profile data
  isLoading?: boolean;
  // when we are saving (general flag)
  isSaving?: boolean;
  errors: {
    // key is the context of the error
    // example {'form.username': new Error('username is taken')}
    [key: string]: {
      error: Error;
      critical: boolean;
    };
  };
  settings: BoxSettings;
  visitingProfile: DataBox & { emoji?: string };
}

export interface IStateErrorPayload {
  errorKey: string;
  error: Error;
  critical: boolean;
}

export interface ProfileStateModel {
  data: ProfileState;
  updateData: Action<ProfileStateModel, Partial<ProfileState>>;
  createError: Action<ProfileStateModel, IStateErrorPayload>;
  getProfile: Thunk<ProfileStateModel, string>;
  fetchCurrent: Thunk<ProfileStateModel>;
  updateProfileData: Thunk<ProfileStateModel, {}>;
  getBoxSettings: Thunk<ProfileStateModel, string>;
  saveBoxSettings: Thunk<
    ProfileStateModel,
    { ethAddress: string; pinningNode: string; addressServer: string }
  >;
  resetBoxSettings: Thunk<ProfileStateModel, string>;
  getLoggedEthAddress: Thunk<ProfileStateModel>;
}

export const profileStateModel: ProfileStateModel = {
  data: {
    ethAddress: null,
    profileData: {
      name: '',
      image: '',
      coverPhoto: '',
      description: '',
    },
    openBoxConsent: false,
    openSpaceConsent: false,
    isLoading: undefined,
    isSaving: undefined,
    errors: {},
    settings: persist({
      pinningNode: '',
      addressServer: '',
    }),
    visitingProfile: persist({}),
  },
  updateData: action((state, payload) => {
    state.data = Object.assign({}, state.data, payload);
  }),
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
  getLoggedEthAddress: thunk(async (actions, _notPassed, { injections, getState }) => {
    const { channels, channelUtils } = injections;
    const $stash = channels.commons.cache_service.getStash(null);
    const $web3Instance = channels.commons.web3_service.web3(null);
    const call = channelUtils.observable.forkJoin({
      stash: $stash,
      web3Instance: $web3Instance,
    });
    return call.subscribe(async (deps: { stash: any; web3Instance: any }) => {
      try {
        const ethAddress = await getEthAddress(deps.stash, deps.web3Instance);
        // reset consents if the payload has an eth address that it's not the
        // same as in the state
        if (getState().data.ethAddress && getState().data.ethAddress !== ethAddress) {
          actions.updateData({
            openBoxConsent: false,
            openSpaceConsent: false,
          });
        }
        actions.updateData({
          ethAddress,
        });
      } catch (err) {
        // having the eth address is mandatory in this case
        actions.createError({
          errorKey: 'actions.getLoggedEthAddress',
          error: err,
          critical: true,
        });
      }
    });
  }),
  fetchCurrent: thunk(async (actions, _ethAddress, { injections }) => {
    const { channels, channelUtils } = injections;
    const { commons } = channels;
    const $stash = commons.cache_service.getStash(null);
    const $web3Instance = commons.web3_service.web3(null);
    const $web3Utils = commons.web3_utils_service.getUtils(null);
    const call = channelUtils.observable.forkJoin({
      stash: $stash,
      web3Instance: $web3Instance,
      web3Utils: $web3Utils,
    });

    return call.subscribe(
      async (deps: any) => {
        try {
          const result = await authenticateBox(
            deps.stash,
            deps.web3Instance,
            deps.web3Utils,
            () => {
              // when user consented to open the box
              actions.updateData({
                openBoxConsent: true,
              });
            },
            () => {
              // when user consented to open the space
              // it's obvious that after this step we are
              // fetching the profile data, so switch isLoading
              // to true
              actions.updateData({
                openSpaceConsent: true,
                isLoading: true,
              });
            },
          );
          const { profileData, ethAddress } = result;
          // tslint:disable-next-line: prefer-const
          let { image, coverPhoto, ...others } = profileData;
          image = getImageProperty(image);
          coverPhoto = getImageProperty(coverPhoto);
          actions.updateData({
            ethAddress: ethAddress,
            isLoading: false,
            profileData: {
              ...others,
              image,
              coverPhoto,
            },
          });
        } catch (err) {
          actions.updateData({
            isLoading: false,
          });
          actions.createError({
            errorKey: 'action.fetchCurrent',
            error: err,
            critical: true,
          });
        }
      },
      (err: Error) => {
        actions.updateData({
          isLoading: false,
        });
        actions.createError({
          errorKey: 'actions.fetchCurrent',
          error: err,
          critical: false,
        });
      },
    );
  }),
  getProfile: thunk(async (actions, ethAddress, { injections }) => {
    const { getProfileData, channelUtils } = injections;
    const call = channelUtils.observable.from(getProfileData(ethAddress));
    return call.subscribe(
      (data: any) => {
        let imagesrc;
        let coverImageSrc;
        if (data.image) {
          imagesrc = getImageProperty(data.image);
        }
        if (data.coverPhoto) {
          coverImageSrc = getImageProperty(data.coverPhoto);
        }
        actions.updateData({
          visitingProfile: {
            ...data,
            image: imagesrc,
            coverPhoto: coverImageSrc,
          },
        });
      },
      (err: Error) =>
        actions.createError({ errorKey: 'actions.getProfile', error: err, critical: false }),
    );
  }),
  updateProfileData: thunk(async (actions, profileData, { getState }) => {
    actions.updateData({
      isSaving: true,
    });
    try {
      const resp = await updateBoxData(profileData);
      const updatedProfile = {
        ...getState().data.profileData,
        ...resp.profileData,
      };
      actions.updateData({
        ethAddress: resp.ethAddress,
        profileData: updatedProfile,
        isSaving: false,
      });
    } catch (ex) {
      actions.updateData({
        isSaving: false,
      });
      actions.createError({
        errorKey: 'action.updateProfileData',
        error: ex,
        critical: false,
      });
    }
  }),
  getBoxSettings: thunk(async (actions, ethAddress, { injections }) => {
    let settings = getDefaultBoxSettings();
    const { channels } = injections;

    const call = channels.db.settings_attachment.get({
      ethAddress,
      id: `3box-settings-ID`,
    });

    call.subscribe((data: any) => {
      if (data) {
        const boxSettings = JSON.parse(data);
        settings = {
          pinningNode: boxSettings.pinningNode,
          addressServer: boxSettings.addressServer,
        };
      }
      actions.updateData({ settings });
    });
  }),
  saveBoxSettings: thunk(async (actions, payload, { injections }) => {
    const { ethAddress, ...data } = payload;
    const { channels } = injections;
    const call = channels.db.settings_attachment.put({
      ethAddress: payload.ethAddress,
      obj: { data: JSON.stringify(data), type: 'string', id: '3box-settings-ID' },
    });
    call.subscribe(async ({ doc }: any) => {
      const attachment = await doc.getAttachment('3box-settings-ID');
      const text = await attachment.getStringData();
      actions.updateData({
        settings: {
          pinningNode: JSON.parse(text).pinningNode,
          addressServer: JSON.parse(text).addressServer,
        },
      });
    });
  }),
  resetBoxSettings: thunk(async (actions, ethAddress, { injections }) => {
    const { channels } = injections;
    const defaultSettings = getDefaultBoxSettings();
    const call = channels.db.settings_attachment.deleteSettings({
      ethAddress,
      id: '3box-settings-ID',
    });
    call.subscribe(() => {
      actions.updateData({
        settings: defaultSettings,
      });
    });
  }),
};

export const useBoxProfile = (channels?: any, channelUtils?: any) =>
  createComponentStore(profileStateModel, {
    name: '3box-ProfileState',
    injections: { channels, channelUtils, getProfileData: getProfile },
  })();
