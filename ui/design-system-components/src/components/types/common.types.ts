import { Profile } from '@akashaorg/typings/ui';

export type Link = {
  type: string;
  value: string;
};

export type Developer = {
  profileId: Profile['did']['id'];
  avatar: Profile['avatar'];
  name: Profile['name'];
  userName: string;
};
