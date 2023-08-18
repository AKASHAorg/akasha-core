import { AkashaProfileLinkSource } from '@akashaorg/typings/sdk/graphql-types-new';
import { Profile } from '@akashaorg/typings/ui';

export type Link = AkashaProfileLinkSource;

export type Developer = {
  profileId: Profile['did']['id'];
  avatar: Profile['avatar'];
  name: Profile['name'];
};

export type EmptyCardSize = { width?: string | number; height?: string | number };
