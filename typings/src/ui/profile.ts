import {
  CeramicAccount,
  AkashaFollowConnection,
  AkashaProfile as ProfileData,
  AkashaFollow,
} from '../sdk/graphql-types-new';

export type AkashaProfile = Omit<ProfileData, 'followers' | 'did' | 'followersCount'> & {
  did: Partial<CeramicAccount>;
  followers?: AkashaFollowConnection;
  followersCount?: number;
};

export type Profile = AkashaProfile;

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

export type ProfileImageType = 'avatar' | 'cover-image';

export type AkashaFollowers = {
  id: AkashaFollow['id'];
  isFollowing: AkashaFollow['isFollowing'];
  did?: { [key in keyof Pick<CeramicAccount, 'akashaProfile'>]: AkashaProfile };
}[];

export type AkashaFollowing = {
  id: AkashaFollow['id'];
  isFollowing: AkashaFollow['isFollowing'];
  profile?: AkashaProfile;
  did?: { id: string };
}[];

export type AkashaFollowDocument = {
  id: AkashaFollow['id'];
  isFollowing: AkashaFollow['isFollowing'];
  profile?: AkashaProfile;
  profileID: AkashaFollow['profileID'];
};

export type FollowList = Map<string, AkashaFollowDocument>;
