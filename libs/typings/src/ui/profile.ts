import {
  CeramicAccount,
  AkashaFollowConnection,
  AkashaProfile as ProfileData,
} from '../sdk/graphql-types-new';
import { Image } from './media';

/**
 * Type defining plain old javascript object of a profile data
 **/
export type AkashaProfile = Omit<
  ProfileData,
  'followers' | 'did' | 'followersCount' | 'appID' | 'appVersionID'
> & {
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
 * Type defining profile data to be published
 **/
export type PublishProfileData = {
  name?: string;
  bio?: string;
  nsfw?: boolean;
  links: string[];
  avatar?: Image | File;
  coverImage?: Image | File;
};
