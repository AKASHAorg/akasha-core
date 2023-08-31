type GeneralFormValues = {
  userName?: string;
  name?: string;
  avatar?: File | null;
  coverImage?: File | null;
  ens?: string;
  bio?: string;
};

type SocialLinkFormValue = {
  links: string[];
};

export type EditProfileFormValues = GeneralFormValues & SocialLinkFormValue;
