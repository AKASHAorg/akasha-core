import {
  CeramicAccount,
  AkashaFollowConnection,
  AkashaProfile as ProfileData,
  AkashaFollow,
} from '../sdk/graphql-types-new';

/**
 * Type defining plain old javascript object of a profile data
 **/
export type AkashaProfile = Omit<ProfileData, 'followers' | 'did' | 'followersCount'> & {
  did: Partial<CeramicAccount>;
  followers?: AkashaFollowConnection;
  followersCount?: number;
};

/**
 * Alias of AkashaProfile type
 * @see {@link AkashaProfile}
 **/
export type Profile = AkashaProfile;

/**
 * Type defining profile image types
 **/
export type ProfileImageType = 'avatar' | 'cover-image';

/**
 * Type defining follower info list
 **/
export type AkashaFollowers = {
  id: AkashaFollow['id'];
  isFollowing: AkashaFollow['isFollowing'];
  did?: { [key in keyof Pick<CeramicAccount, 'akashaProfile'>]: AkashaProfile };
}[];

/**
 * Type defining following info list
 **/
export type AkashaFollowing = {
  id: AkashaFollow['id'];
  isFollowing: AkashaFollow['isFollowing'];
  profile?: AkashaProfile;
  did?: { id: string };
}[];

/**
 * Type defining follow document which represents either followers or following info
 **/
export type AkashaFollowDocument = {
  id: AkashaFollow['id'];
  isFollowing: AkashaFollow['isFollowing'];
  profile?: AkashaProfile;
  profileID: AkashaFollow['profileID'];
};

/**
 * Type defining  follow list which is a map of profile stream id and AkashaFollowDocument
 * @see {@link AkashaFollowDocument}
 **/
export type FollowList = Map<string, AkashaFollowDocument>;
