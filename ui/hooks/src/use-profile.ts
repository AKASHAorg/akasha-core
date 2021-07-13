import * as React from 'react';
import { from, Observable, Subscription, timer } from 'rxjs';
import { filter, switchMap, exhaustMap } from 'rxjs/operators';
import { IAkashaError, Awaited } from '@akashaproject/ui-awf-typings';
import getSDK from '@akashaproject/awf-sdk';
import { events } from '@akashaproject/sdk-typings';
import {
  IProfileData,
  IProfileProvider,
  ProfileProviderProperties,
  ProfileProviders,
  UsernameTypes,
} from '@akashaproject/ui-awf-typings/lib/profile';
import { createErrorHandler } from './utils/error-handler';
import { getMediaUrl } from './utils/media-utils';

type voidFunc<T = Record<string, unknown>> = (arg: T) => void;

export interface UseProfileActions {
  getProfileData: (
    payload: { pubKey?: string | null; ethAddress?: string | null },
    disableLoadingIndicator?: boolean,
  ) => void;
  getEntryAuthor: voidFunc<{ entryId: string }>;
  resetProfileData: () => void;
  optimisticUpdate: (data: any) => void;
  updateProfile: (fields: any) => void;
  resetUpdateStatus: () => void;
  validateUsername: ({ userName }: { userName: string }) => void;
  /**
   * get available username provider types
   * return UsernameTypes[]
   */
  getUsernameTypes: () => { default?: IProfileProvider; available: UsernameTypes[] };
  /**
   * Add/Change the username's default provider
   * used for ens domains and to 'unset'
   * a username by providing an empty value.
   * This method does not interact with ens in any way.
   */
  updateUsernameProvider: (payload: { userName: string; provider: ProfileProviders }) => void;
}

export interface UseProfileProps {
  onError?: (error: IAkashaError) => void;
  logger?: any;
}

export interface ProfileUpdateStatus {
  saving: boolean;
  uploadingAvatar: boolean;
  uploadingCoverImage: boolean;
  updateComplete: boolean;
  isValidating: boolean;
  isValidUsername: boolean | null;
  /* additional context for isValidUsername flag */
  /* when true, it means the regex failed: username contains invalid characters */
  notAllowed: boolean;
  /* true when the username.length < 3 characters */
  tooShort: boolean;
  validateUsernameQuery: string | null;
  optimisticUpdateQuery: any | null;
  updateUsernameProviderQuery: { userName: string; provider: string } | null;
}

const initialProfileUpdateStatus = {
  saving: false,
  uploadingAvatar: false,
  uploadingCoverImage: false,
  updateComplete: false,
  isValidUsername: null,
  isValidating: false,
  notAllowed: false,
  tooShort: false,
  // reducer related
  validateUsernameQuery: null,
  optimisticUpdateQuery: null,
  updateUsernameProviderQuery: null,
};

export type IProfileUpdateStatusAction =
  | { type: 'VALIDATE_USERNAME'; payload: string }
  | { type: 'VALIDATE_USERNAME_SUCCESS'; payload: boolean | null }
  | { type: 'VALIDATE_USERNAME_TOO_SHORT' }
  | { type: 'VALIDATE_USERNAME_NOT_ALLOWED' }
  | { type: 'OPTIMISTIC_UPDATE'; payload: any }
  | { type: 'SAVING' }
  | { type: 'UPDATE_COMPLETE' }
  | { type: 'UPLOADING_AVATAR' }
  | { type: 'UPLOADING_COVER_IMAGE' }
  | { type: 'UPLOADING_AVATAR_SUCCESS' }
  | { type: 'UPLOADING_COVER_IMAGE_SUCCESS' }
  | { type: 'UPDATE_USERNAME_PROVIDER'; payload: { userName: string; provider: string } }
  | { type: 'UPDATE_USERNAME_PROVIDER_SUCCESS' }
  | { type: 'RESET_UPDATE_STATUS' };

const profileUpdateStatusReducer = (
  state: ProfileUpdateStatus,
  action: IProfileUpdateStatusAction,
) => {
  switch (action.type) {
    case 'VALIDATE_USERNAME':
      return {
        ...state,
        validateUsernameQuery: action.payload,
        isValidating: true,
        notAllowed: false,
        tooShort: false,
      };
    case 'VALIDATE_USERNAME_SUCCESS':
      return {
        ...state,
        validateUsernameQuery: null,
        isValidUsername: action.payload,
        isValidating: false,
        notAllowed: false,
      };
    case 'VALIDATE_USERNAME_TOO_SHORT':
      return {
        ...state,
        validateUsernameQuery: null,
        isValidUsername: false,
        isValidating: false,
        notAllowed: false,
        tooShort: true,
      };
    case 'VALIDATE_USERNAME_NOT_ALLOWED':
      return {
        ...state,
        validateUsernameQuery: null,
        isValidUsername: false,
        isValidating: false,
        notAllowed: true,
        tooShort: false,
      };

    case 'OPTIMISTIC_UPDATE':
      return {
        ...state,
        optimisticUpdateQuery: action.payload,
      };

    case 'SAVING':
      return {
        ...state,
        saving: true,
      };

    case 'UPDATE_COMPLETE':
      return {
        ...state,
        saving: false,
        updateComplete: true,
        optimisticUpdateQuery: null,
      };

    case 'UPLOADING_AVATAR':
      return {
        ...state,
        uploadingAvatar: true,
      };
    case 'UPLOADING_COVER_IMAGE':
      return {
        ...state,
        uploadingCoverImage: true,
      };

    case 'UPLOADING_AVATAR_SUCCESS':
      return {
        ...state,
        uploadingAvatar: false,
      };
    case 'UPLOADING_COVER_IMAGE_SUCCESS':
      return {
        ...state,
        uploadingCoverImage: false,
      };

    case 'UPDATE_USERNAME_PROVIDER':
      return {
        ...state,
        updateUsernameProviderQuery: action.payload,
        saving: true,
        updateComplete: false,
        uploadingAvatar: false,
        isValidating: false,
        uploadingCoverImage: false,
        isValidUsername: null,
        notAllowed: false,
        tooShort: false,
      };

    case 'UPDATE_USERNAME_PROVIDER_SUCCESS':
      return {
        ...state,
        updateUsernameProviderQuery: null,
        saving: false,
        updateComplete: true,
      };

    case 'RESET_UPDATE_STATUS':
      return {
        ...state,
        saving: false,
        uploadingAvatar: false,
        uploadingCoverImage: false,
        updateComplete: false,
        isValidUsername: null,
        isValidating: false,
        notAllowed: false,
        tooShort: false,
      };

    default:
      throw new Error('[UseProfileUpdateStatusReducer] action is not defined!');
  }
};

export interface IProfileState extends IProfileData {
  isLoading: boolean;
  getProfileDataQuery: {
    payload: { pubKey?: string | null; ethAddress?: string | null };
    disableLoadingIndicator?: boolean;
  } | null;
  getEntryAuthorQuery: string | null;
}

const initialProfileState = {
  isLoading: true,
  getProfileDataQuery: null,
  getEntryAuthorQuery: null,
};

export type IProfileAction =
  | {
      type: 'GET_PROFILE_DATA';
      payload: {
        payload: { pubKey?: string | null; ethAddress?: string | null };
        disableLoadingIndicator?: boolean;
      };
    }
  | { type: 'GET_PROFILE_DATA_SUCCESS'; payload: any }
  | { type: 'GET_ENTRY_AUTHOR'; payload: string }
  | { type: 'GET_ENTRY_AUTHOR_SUCCESS'; payload: IProfileData }
  | { type: 'UPDATE_PROFILE'; payload: Partial<IProfileData> }
  | { type: 'RESET_PROFILE_DATA' };

const profileStateReducer = (
  state: Partial<IProfileData & { isLoading: boolean }>,
  action: IProfileAction,
) => {
  switch (action.type) {
    case 'GET_PROFILE_DATA':
      return {
        ...state,
        getProfileDataQuery: action.payload,
        isLoading: !action.payload.disableLoadingIndicator,
      };
    case 'GET_PROFILE_DATA_SUCCESS':
      return { ...state, ...action.payload, isLoading: false, getProfileDataQuery: null };

    case 'GET_ENTRY_AUTHOR':
      return {
        ...state,
        getEntryAuthorQuery: action.payload,
      };
    case 'GET_ENTRY_AUTHOR_SUCCESS':
      return { ...state, ...action.payload, getEntryAuthorQuery: null };

    case 'UPDATE_PROFILE':
      return {
        ...state,
        ...action.payload,
      };

    case 'RESET_PROFILE_DATA':
      return {};

    default:
      throw new Error('[UseProfileStateReducer] action is not defined!');
  }
};

/* A hook to be used on profile-page */
export const useProfile = (
  props: UseProfileProps,
): [IProfileState, UseProfileActions, ProfileUpdateStatus] => {
  const { onError, logger } = props;

  const sdk = getSDK();

  const [profile, dispatchProfile] = React.useReducer(profileStateReducer, initialProfileState);
  const [updateStatus, dispatchUpdateStatus] = React.useReducer(
    profileUpdateStatusReducer,
    initialProfileUpdateStatus,
  );

  React.useEffect(() => {
    const sub = sdk.api.globalChannel
      .pipe(
        filter(payload => {
          return payload.event === events.PROFILE_EVENTS.DEFAULT_PROVIDER;
        }),
      )
      .subscribe({
        next: () => {
          if (profile.pubKey) {
            actions.getProfileData({ pubKey: profile.pubKey }, true);
          }
        },
      });
    return () => sub.unsubscribe();
  }, [profile]);

  React.useEffect(() => {
    if (profile.getProfileDataQuery) {
      const ipfsGateway = sdk.services.common.ipfs.getSettings().gateway;
      const getProfileCall = sdk.api.profile.getProfile(profile.getProfileDataQuery.payload);

      const sub = getProfileCall.subscribe({
        next: resp => {
          if (!resp.data) {
            return;
          }

          const { avatar, coverImage, ...other } = resp.data.getProfile || resp.data.resolveProfile;
          const images: { avatar?: string; coverImage?: string } = {};
          if (avatar) {
            images.avatar = getMediaUrl(ipfsGateway, avatar);
          }
          if (coverImage) {
            images.coverImage = getMediaUrl(ipfsGateway, coverImage);
          }
          dispatchProfile({ type: 'GET_PROFILE_DATA_SUCCESS', payload: { ...images, ...other } });
        },
        error: createErrorHandler('useProfile.getProfileData.subscription', false, onError),
      });
      return () => sub.unsubscribe();
    }
    return;
  }, [profile.getProfileDataQuery]);

  React.useEffect(() => {
    const userName = updateStatus.validateUsernameQuery;
    if (userName) {
      if (/^([a-z0-9.](?![0-9.]$))+$/g.test(userName) && userName.length >= 3) {
        (async () => {
          try {
            const resp = await sdk.api.ens.isAvailable(userName);
            dispatchUpdateStatus({ type: 'VALIDATE_USERNAME_SUCCESS', payload: resp });
          } catch (error) {
            createErrorHandler('useProfile.validateUsername', false, props.onError)(error);
          }
        })();
      } else if (userName.length < 3) {
        dispatchUpdateStatus({ type: 'VALIDATE_USERNAME_TOO_SHORT' });
      } else {
        dispatchUpdateStatus({ type: 'VALIDATE_USERNAME_NOT_ALLOWED' });
      }
    }
    return;
  }, [updateStatus.validateUsernameQuery]);

  React.useEffect(() => {
    if (profile.getEntryAuthorQuery) {
      const getEntryCall = sdk.api.entries.getEntry(profile.getEntryAuthorQuery);
      const ipfsGateway = sdk.services.common.ipfs.getSettings().gateway;
      const sub = getEntryCall.subscribe({
        next: resp => {
          if (!resp.data) {
            return;
          }
          const { getPost: entry } = resp.data;
          if (entry && entry.author) {
            dispatchProfile({
              type: 'GET_ENTRY_AUTHOR_SUCCESS',
              payload: {
                ...entry.author,
                avatar: getMediaUrl(ipfsGateway, entry.author.avatar),
                coverImage: getMediaUrl(ipfsGateway, entry.author.coverImage),
              },
            });
          }
        },
        error: createErrorHandler('useProfile.getEntryAuthor', false, onError),
      });
      return () => sub.unsubscribe();
    }
    return;
  }, [profile.getEntryAuthorQuery]);

  React.useEffect(() => {
    if (updateStatus.optimisticUpdateQuery) {
      const {
        avatar,
        coverImage,
        name,
        description,
        userName,
      } = updateStatus.optimisticUpdateQuery;

      const ipfsGateway = sdk.services.common.ipfs.getSettings().gateway;

      let userNameSub: Subscription;
      let addProvidersSub: Subscription;
      let avatarRes: Awaited<ReturnType<typeof sdk.api.profile.saveMediaFile>>;
      let coverImageRes: Awaited<ReturnType<typeof sdk.api.profile.saveMediaFile>>;

      dispatchUpdateStatus({ type: 'SAVING' });

      (async () => {
        if (avatar && avatar.src && avatar.preview !== profile.avatar) {
          dispatchUpdateStatus({ type: 'UPLOADING_AVATAR' });
          try {
            avatarRes = await sdk.api.profile.saveMediaFile({
              isUrl: avatar.isUrl,
              content: avatar.src,
              name: ProfileProviderProperties.AVATAR,
            });
            dispatchUpdateStatus({ type: 'UPLOADING_AVATAR_SUCCESS' });
          } catch (error) {
            createErrorHandler('useProfile.uploadAvatar', false, onError)(error);
          }
        }

        if (coverImage && coverImage.src && coverImage.preview !== profile.coverImage) {
          dispatchUpdateStatus({ type: 'UPLOADING_COVER_IMAGE' });
          try {
            coverImageRes = await sdk.api.profile.saveMediaFile({
              isUrl: coverImage.isUrl,
              content: coverImage.src,
              name: ProfileProviderProperties.COVER_IMAGE,
            });
            dispatchUpdateStatus({ type: 'UPLOADING_COVER_IMAGE_SUCCESS' });
          } catch (error) {
            createErrorHandler('useProfile.uploadCoverImage', false, onError)(error);
          }
        }

        if (userName && !profile.userName) {
          const userNameCall = sdk.api.profile.registerUserName(userName);
          userNameSub = userNameCall.subscribe({
            next: userNameRes => {
              const providers: any[] = [];

              if (!avatarRes && avatar === null) {
                providers.push({
                  provider: ProfileProviders.EWA_BASIC,
                  property: ProfileProviderProperties.AVATAR,
                  value: '',
                });
              }
              if (avatarRes && avatarRes.CID) {
                providers.push({
                  provider: ProfileProviders.EWA_BASIC,
                  property: ProfileProviderProperties.AVATAR,
                  value: avatarRes.CID,
                });
              }
              if (!coverImageRes && coverImage === null) {
                providers.push({
                  provider: ProfileProviders.EWA_BASIC,
                  property: ProfileProviderProperties.COVER_IMAGE,
                  value: '',
                });
              }
              if (coverImageRes && coverImageRes.CID) {
                providers.push({
                  provider: ProfileProviders.EWA_BASIC,
                  property: ProfileProviderProperties.COVER_IMAGE,
                  value: coverImageRes.CID,
                });
              }
              if (description) {
                providers.push({
                  provider: ProfileProviders.EWA_BASIC,
                  property: ProfileProviderProperties.DESCRIPTION,
                  value: description,
                });
              }
              if (name) {
                providers.push({
                  provider: ProfileProviders.EWA_BASIC,
                  property: ProfileProviderProperties.NAME,
                  value: name,
                });
              }
              let addProvider: Observable<any> = from([null]);
              if (userNameRes) {
                providers.push({
                  provider: ProfileProviders.EWA_BASIC,
                  property: ProfileProviderProperties.USERNAME,
                  value: userName,
                });
                addProvider = sdk.api.profile.addProfileProvider([
                  {
                    provider: ProfileProviders.EWA_BASIC,
                    property: ProfileProviderProperties.USERNAME,
                    value: userName,
                  },
                ]);
              }
              const makeDefault = sdk.api.profile.makeDefaultProvider(providers);
              const call = addProvider.pipe(switchMap(() => makeDefault));
              addProvidersSub = call.subscribe({
                next: () => {
                  const updatedFields: { [key: string]: any } = providers
                    .map(provider => {
                      if (
                        (provider.property === ProfileProviderProperties.COVER_IMAGE ||
                          provider.property === ProfileProviderProperties.AVATAR) &&
                        !!provider.value
                      ) {
                        return {
                          [provider.property]: `${ipfsGateway}/${provider.value}`,
                        };
                      }
                      return { [provider.property]: provider.value };
                    })
                    .reduce((acc, curr) => Object.assign(acc, curr), {});

                  if (updatedFields.userName && !profile.userName) {
                    updatedFields.providers = [
                      {
                        provider: ProfileProviders.EWA_BASIC,
                        property: ProfileProviderProperties.USERNAME,
                        value: updatedFields.userName,
                      },
                    ];
                    updatedFields.default = [
                      {
                        provider: ProfileProviders.EWA_BASIC,
                        property: ProfileProviderProperties.USERNAME,
                        value: updatedFields.userName,
                      },
                    ];
                  }
                  actions.updateProfile(updatedFields);
                  dispatchUpdateStatus({ type: 'UPDATE_COMPLETE' });
                },
                error: createErrorHandler(
                  'useProfile.optimisticUpdate.addProviders',
                  false,
                  onError,
                ),
              });
            },
            error: createErrorHandler('useProfile.registerUsername', false, onError),
          });
        }
      })();
      return () => {
        if (userNameSub.unsubscribe) {
          userNameSub.unsubscribe();
        }
        if (addProvidersSub.unsubscribe) {
          addProvidersSub.unsubscribe();
        }
      };
    }
    return;
  }, [updateStatus.optimisticUpdateQuery]);

  React.useEffect(() => {
    if (updateStatus.updateUsernameProviderQuery) {
      const { userName, provider } = updateStatus.updateUsernameProviderQuery;
      let addProvider: Observable<any> = from([null]);
      const providerData = {
        provider,
        property: ProfileProviderProperties.USERNAME,
        value: userName,
      };
      if (profile.providers?.length) {
        if (!profile.providers.find((p: { provider: string }) => p.provider === provider)) {
          addProvider = sdk.api.profile.addProfileProvider([providerData]);
        }
      }

      const makeDefault = sdk.api.profile.makeDefaultProvider([providerData]);
      const call = addProvider.pipe(exhaustMap(() => makeDefault));
      const sub = call.subscribe({
        next: () => {
          actions.updateProfile({
            default: [
              ...profile.default.filter(
                (p: { property: ProfileProviderProperties }) =>
                  p.property !== ProfileProviderProperties.USERNAME,
              ),
              providerData,
            ],
          });
          dispatchUpdateStatus({ type: 'UPDATE_USERNAME_PROVIDER_SUCCESS' });
        },
        error: createErrorHandler('useProfile.updateUsernameProvider', false, onError),
      });
      return () => sub.unsubscribe();
    }
    return;
  }, [updateStatus.updateUsernameProviderQuery]);

  const actions: UseProfileActions = {
    getProfileData(payload, disableLoadingIndicator) {
      dispatchProfile({ type: 'GET_PROFILE_DATA', payload: { payload, disableLoadingIndicator } });
    },
    validateUsername({ userName }) {
      dispatchUpdateStatus({ type: 'VALIDATE_USERNAME', payload: userName });
    },
    getEntryAuthor({ entryId }) {
      dispatchProfile({ type: 'GET_ENTRY_AUTHOR', payload: entryId });
    },
    updateProfile(fields) {
      dispatchProfile({ type: 'UPDATE_PROFILE', payload: fields });
    },
    optimisticUpdate(data) {
      dispatchUpdateStatus({ type: 'OPTIMISTIC_UPDATE', payload: data });
    },
    updateUsernameProvider({ userName, provider }) {
      dispatchUpdateStatus({ type: 'UPDATE_USERNAME_PROVIDER', payload: { userName, provider } });
    },
    resetUpdateStatus() {
      dispatchUpdateStatus({ type: 'RESET_UPDATE_STATUS' });
    },
    resetProfileData() {
      dispatchProfile({ type: 'RESET_PROFILE_DATA' });
      actions.resetUpdateStatus();
    },
    getUsernameTypes() {
      const type: UsernameTypes[] = [];

      let defaultProvider = profile.default?.find(
        (p: { property: ProfileProviderProperties }) =>
          p.property === ProfileProviderProperties.USERNAME,
      );
      /**
       * treat the case of failure in saving the default username provider
       * in the onboarding step
       */
      if (!defaultProvider && profile.userName) {
        defaultProvider = {
          provider: ProfileProviders.EWA_BASIC,
          property: ProfileProviderProperties.USERNAME,
          value: profile.userName,
        };
        const call = sdk.api.profile.makeDefaultProvider([defaultProvider]);
        call.subscribe({
          error(err: Error) {
            if (logger) {
              logger.error(`makeDefaultProvider error (getUsernameTypes): ${err}`);
            }
          },
        });
      }

      if (profile.providers?.length) {
        profile.providers.forEach(
          (provider: {
            provider: ProfileProviders;
            property: ProfileProviderProperties;
            value: string;
          }) => {
            if (provider.property === ProfileProviderProperties.USERNAME) {
              if (provider.provider === ProfileProviders.ENS) {
                if (provider.value.endsWith('.akasha.eth')) {
                  type.push(UsernameTypes.AKASHA_ENS_SUBDOMAIN);
                } else if (provider.value.endsWith('.eth')) {
                  type.push(UsernameTypes.ENS_DOMAIN);
                }
              }
              if (provider.provider === ProfileProviders.EWA_BASIC) {
                type.push(UsernameTypes.TEXTILE);
              }
            }
          },
        );
      }
      /**
       * treat the case of failure in saving the profile provider
       * in the onboarding phase
       */
      if (profile.providers?.length === 0 && profile.userName) {
        const call = timer(2000).pipe(
          switchMap(() =>
            sdk.api.profile.addProfileProvider([
              {
                property: ProfileProviderProperties.USERNAME,
                value: profile.userName,
                provider: ProfileProviders.EWA_BASIC,
              },
            ]),
          ),
        );
        call.subscribe({
          error(err: Error) {
            if (logger) {
              logger.error(`Error in getUsernameTypes: ${err}`);
            }
          },
        });
        type.push(UsernameTypes.TEXTILE);
      }

      return {
        default: defaultProvider,
        available: type,
      };
    },
  };

  return [profile, actions, updateStatus];
};

export default useProfile;
