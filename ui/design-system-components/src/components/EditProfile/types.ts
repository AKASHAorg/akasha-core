export type EditProfileFormValues = {
  userName?: string;
  name?: string;
  avatar?: File | null;
  coverImage?: File | null;
  ens?: string;
  bio?: string;
  links: string[];
};
