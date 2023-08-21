import {
  CeramicAccount,
  AkashaFollowConnection,
  AkashaProfile as ProfileData,
} from '../sdk/graphql-types-new';

export type Profile = Omit<ProfileData, 'followers' | 'did'> & {
  did: Partial<CeramicAccount>;
  followers?: AkashaFollowConnection;
};

export enum UsernameTypes {
  TEXTILE = 0,
  ENS_DOMAIN,
  AKASHA_ENS_SUBDOMAIN,
}

export enum ProfileProviders {
  EWA_BASIC = 'ewa.providers.basic',
  ENS = 'ewa.providers.ens',
}

export enum ProfileProviderProperties {
  AVATAR = 'avatar',
  COVER_IMAGE = 'coverImage',
  DESCRIPTION = 'description',
  NAME = 'name',
  USERNAME = 'userName',
  SOCIAL_LINKS = 'socialLinks',
}

export enum UpdateProfileStatus {
  UPDATE_IDLE = 0,
  UPDATE_INITIATED,
  UPLOADING_AVATAR,
  UPLOADING_COVER_IMAGE,
  REGISTERING_USERNAME,
  // generic status for when the profile update is in progress
  UPDATE_IN_PROGRESS,
  UPDATE_COMPLETE,
}

export enum StorageKeys {
  LAST_URL = 'lastUrl',
}

export enum StepStatus {
  VALIDATING = 'validatingMessage',
  ADDING_KEY = 'addingKey',
  GETTING_KEYS = 'gettingKeys',
}

export type EngagementType = 'followers' | 'following' | 'interests';

export type ProfileImageType = 'avatar' | 'cover-image';
