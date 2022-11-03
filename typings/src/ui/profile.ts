import { DataProviderInput } from '../sdk/common';
export interface IProfileProvider {
  property: ProfileProviderProperties;
  provider: ProfileProviders;
  value: string;
}

export interface IProfileData {
  CID?: string;
  avatar?: { url?: string; fallbackUrl?: string };
  coverImage?: { url?: string; fallbackUrl?: string };
  userName?: string;
  description?: string;
  name?: string;
  ethAddress: string;
  pubKey: string;
  totalPosts?: string | number;
  totalFollowers?: string | number;
  totalFollowing?: string | number;
  totalInterests?: number;
  default: DataProviderInput[];
  providers: DataProviderInput[];
  contentId?: string;
  reported?: boolean;
  delisted?: boolean;
  moderated?: boolean;
  reason?: string;
  badges?: string[];
}

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
