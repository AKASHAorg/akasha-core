import { Image } from '@akashaorg/typings/lib/ui';

export type EditProfileFormValues = {
  userName?: string;
  name?: string;
  avatar?: Image | File | null;
  coverImage?: Image | File | null;
  ens?: string;
  bio?: string;
  nsfw?: boolean;
  links: string[];
};
