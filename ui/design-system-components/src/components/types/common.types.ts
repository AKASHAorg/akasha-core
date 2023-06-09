import { ProfileLinkSource } from '@akashaorg/typings/sdk/graphql-types-new';
import { Profile } from '@akashaorg/typings/ui';

export type Link = ProfileLinkSource;

export type Developer = {
  profileId: Profile['did']['id'];
  avatar: Profile['avatar'];
  name: Profile['name'];
  userName: string;
};
