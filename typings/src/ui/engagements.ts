import { AkashaFollow, CeramicAccount } from '../sdk/graphql-types-new';

export type AkashaFollowers = {
  id: AkashaFollow['id'];
  isFollowing: AkashaFollow['isFollowing'];
  did?: Pick<CeramicAccount, 'akashaProfile'>;
}[];

export type AkashaFollowing = {
  id: AkashaFollow['id'];
  isFollowing: AkashaFollow['isFollowing'];
  profile?: AkashaFollow['profile'];
  did?: { id: string };
}[];
