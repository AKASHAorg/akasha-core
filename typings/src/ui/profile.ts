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

export enum ProfileProviders {
  EWA_BASIC = 'ewa.providers.basic',
  ENS = 'ewa.providers.ens',
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
