export interface IProfileProvider {
  property: string;
  provider: string;
  value: any;
}

export interface IProfileData {
  CID?: string;
  avatar?: string;
  coverImage?: string;
  userName?: string;
  description?: string;
  name?: string;
  url?: string;
  ensName?: string;
  ethAddress: string;
  pubKey: string;
  totalPosts?: string | number;
  totalFollowers?: string | number;
  totalFollowing?: string | number;
  default: IProfileProvider[];
  providers: IProfileProvider[];
  apps?: string | number;
  profileType?: string;
  users?: string | number;
  actions?: string;
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
}
