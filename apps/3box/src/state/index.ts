import { action, thunk, createComponentStore, persist, Action, Thunk } from 'easy-peasy';
import {
  authenticateBox,
  getProfile,
  updateBoxData,
  getEthAddress,
  getDefaultBoxSettings,
} from '../services/box';
import DS from '@akashaproject/design-system';
import { getImageProperty, create3BoxImage } from '../utils/box-image-utils';
import { IImageSrc } from '@akashaproject/design-system/lib/components/Cards/form-cards/box-form-card';

const { formatImageSrc } = DS;

export interface IRawProfileData {
  name?: string;
  image?: string;
  coverPhoto?: string;
  description?: string;
}
export interface IFormattedProfileData {
  name?: string;
  avatar?: IImageSrc;
  coverImage?: IImageSrc;
  description?: string;
}
export interface BoxSettings {
  pinningNode: string;
  addressServer: string;
}

export interface IUpdateProfilePayload extends IFormattedProfileData {
  ethAddress: string;
  providerName: string;
}

export interface ProfileState {
  profileData: IFormattedProfileData;
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
  visitingProfile: IRawProfileData & { emoji?: string };
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
  fetchCurrent: Thunk<ProfileStateModel, string>;
  updateProfileData: Thunk<ProfileStateModel, IUpdateProfilePayload>;
  getBoxSettings: Thunk<ProfileStateModel, string>;
  saveBoxSettings: Thunk<
    ProfileStateModel,
    { ethAddress: string; pinningNode: string; addressServer: string }
  >;
  resetBoxSettings: Thunk<ProfileStateModel, string>;
  getLoggedEthAddress: Thunk<ProfileStateModel>;
}
const BOX_SETTINGS_ID = `3box-settings-ID`;

export const profileStateModel: ProfileStateModel = {
  data: {
    ethAddress: null,
    profileData: {
      name: '',
      avatar: { src: '', prefix: '', isUrl: false },
      coverImage: { src: '', prefix: '', isUrl: false },
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
  // add errors to store, merging them with old ones
  // @TODO: pipe the logger into this method
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
  /**
   * fetch current logged in profile
   */
  fetchCurrent: thunk(async (actions, _ethAddress, { injections }) => {
    const { channels, channelUtils } = injections;
    const { commons, db } = channels;
    const $stash = commons.cache_service.getStash(null);
    const $web3Instance = commons.web3_service.web3(null);
    const $web3Utils = commons.web3_utils_service.getUtils(null);
    const $settingsAttachment = db.settings_attachment.get({
      id: BOX_SETTINGS_ID,
      ethAddress: _ethAddress,
    });
    const call = channelUtils.observable.forkJoin({
      stash: $stash,
      web3Instance: $web3Instance,
      web3Utils: $web3Utils,
      settingsAttachment: $settingsAttachment,
    });

    return call.subscribe(
      async (deps: any) => {
        try {
          const result = await authenticateBox(
            deps.web3Instance,
            deps.web3Utils,
            JSON.parse(deps.settingsAttachment),
            _ethAddress,
            () => {
              // when user consented to open the box
              actions.updateData({
                openBoxConsent: true,
              });
            },
            () => {
              // when user consented to open the space.
              // it's obvious that after this step we are
              // fetching the profile data, so switch isLoading
              // to true
              actions.updateData({
                openSpaceConsent: true,
                isLoading: true,
              });
            },
          );
          const { profileData } = result;
          // tslint:disable-next-line: prefer-const
          let { image, coverPhoto, ...others } = profileData;
          image = formatImageSrc(getImageProperty(image), false, '//ipfs.io/ipfs/');
          coverPhoto = formatImageSrc(getImageProperty(coverPhoto), false, '//ipfs.io/ipfs/');
          actions.updateData({
            ethAddress: _ethAddress,
            isLoading: false,
            profileData: {
              ...others,
              avatar: image,
              coverImage: coverPhoto,
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
  /**
   * get a 3box profile given an eth address
   */
  getProfile: thunk(async (actions, ethAddress, { injections }) => {
    const { getProfileData, channelUtils } = injections;
    const call = channelUtils.observable.from(getProfileData(ethAddress));
    return call.subscribe(
      (data: any) => {
        let imagesrc;
        let coverImageSrc;
        if (data.image) {
          // flatten 3box image object
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
  /**
   * Update profile data on 3Box
   *  - check if there are any images (avatar or coverImage) to update
   *    - if yes => upload them to ipfs and wait for hashes
   *  - update data on 3box, wait for syncdone
   *  - update newly fetched data into store (the service returns full profile data)
   */
  updateProfileData: thunk(async (actions, profileData, { injections }) => {
    actions.updateData({
      isSaving: true,
    });
    const { channels } = injections;
    const imagesToUpload = [];
    try {
      if (profileData.avatar && profileData.avatar.src) {
        imagesToUpload.push({
          content: profileData.avatar.src,
          isUrl: profileData.avatar.isUrl,
        });
      }
      if (profileData.coverImage && profileData.coverImage.src) {
        imagesToUpload.push({
          content: profileData.coverImage.src,
          isUrl: profileData.coverImage.isUrl,
        });
      }

      const onObservableComplete = async (images: string[]) => {
        // handle the case when avatar = null (marked for deletion)
        // handle the case when coverImage = null (marked for deletion)
        // if they are undefined, they will remain unchanged
        let avatarIpfsImage: string | null | undefined = profileData.avatar as undefined | null;
        let coverIpfsImage: string | null | undefined = profileData.coverImage as undefined | null;

        // if they are not undefined or null
        // then we should have ipfs hashes for them

        // @TODO: treat the edge case when somehow we don't get the ipfs
        // hash and still we don't have errors
        // the order is preserved but we must treat the case when only one image is uploaded
        // we are declaring the order as [0 => avatar, 1 => coverImage], so in the case when only coverImage
        // is updated, the order is [0 => coverImage]
        if (profileData.avatar) {
          avatarIpfsImage = images[0];
          coverIpfsImage = images[1];
        } else if (!profileData.avatar && profileData.coverImage) {
          coverIpfsImage = images[0];
        }
        const { avatar, coverImage, ...other } = profileData;
        // convert images to 3box supported format
        // before updating them
        const pData = {
          ...other,
          image: create3BoxImage(avatarIpfsImage),
          coverImage: create3BoxImage(coverIpfsImage),
        };
        const resp = await updateBoxData(pData);
        const { image, coverPhoto, ...otherAttrs } = resp.profileData;
        // do not update images if they are undefined
        // also convert them from 3box format to box-form-card
        // component supported format
        // merge profile state
        const updatedProfile = {
          ...otherAttrs,
          avatar: formatImageSrc(getImageProperty(image), false, '//ipfs.io/ipfs/'),
          coverImage: formatImageSrc(getImageProperty(coverPhoto), false, '//ipfs.io/ipfs/'),
        };
        // deleted images... no need to store them
        if (avatarIpfsImage === null) {
          delete updatedProfile.avatar;
        }
        if (coverIpfsImage === null) {
          delete updatedProfile.coverImage;
        }
        // finally update the store with the latest changes
        actions.updateData({
          ethAddress: resp.ethAddress,
          profileData: updatedProfile,
          isSaving: false,
        });
      };
      // if we don't have images continue
      // else, upload them to ipfs
      if (!imagesToUpload.length) {
        return onObservableComplete([]);
      }
      const ipfsCall = channels.commons.ipfs_service.upload(imagesToUpload);
      // get image hashes
      ipfsCall.subscribe(onObservableComplete);
    } catch (ex) {
      // catch all handler
      // @TODO: create more granular errors
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
  /*
   * Get settings for 3box app
   * if there are no settings in db, get default settings
   * from 3box library
   */
  getBoxSettings: thunk(async (actions, ethAddress, { injections }) => {
    let settings = getDefaultBoxSettings();
    const { channels } = injections;
    const call = channels.db.settings_attachment.get({
      ethAddress,
      id: BOX_SETTINGS_ID,
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
  /**
   * Save new 3box settings overriding default ones
   */
  saveBoxSettings: thunk(async (actions, payload, { injections }) => {
    const { ethAddress, ...data } = payload;
    const { channels } = injections;
    actions.updateData({
      isSaving: true,
    });
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
        isSaving: false,
      });
    });
  }),
  /**
   * Add the ability to reset the settings to default ones
   * from the 3box lib
   */
  resetBoxSettings: thunk(async (actions, ethAddress, { injections }) => {
    const { channels } = injections;
    const defaultSettings = getDefaultBoxSettings();
    actions.updateData({
      isSaving: true,
    });
    const call = channels.db.settings_attachment.deleteSettings({
      ethAddress,
      id: '3box-settings-ID',
    });
    call.subscribe(() => {
      actions.updateData({
        settings: defaultSettings,
        isSaving: false,
      });
    });
  }),
};

export const useBoxProfile = (channels?: any, channelUtils?: any) =>
  createComponentStore(profileStateModel, {
    name: '3box-ProfileState',
    injections: { channels, channelUtils, getProfileData: getProfile },
  })();
