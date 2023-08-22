import { Profile } from './profile';

export type Developer = {
  profileId: Profile['did']['id'];
} & Pick<Profile, 'avatar' | 'name'>;
