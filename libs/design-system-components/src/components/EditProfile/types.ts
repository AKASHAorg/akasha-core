import { Image } from '@akashaorg/typings/lib/ui';

export type EditProfileFormValues = {
  name?: string;
  avatar?: Image | File;
  coverImage?: Image | File;
  bio?: string;
  nsfw?: boolean;
  links: string[];
};
