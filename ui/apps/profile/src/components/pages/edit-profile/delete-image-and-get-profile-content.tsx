import { PartialAkashaProfileInput } from '@akashaorg/typings/sdk/graphql-types-new';
import { ProfileImageType } from '@akashaorg/typings/ui';

interface IDeleteImage {
  profileData?: PartialAkashaProfileInput;
  type: ProfileImageType;
}

export function deleteImageAndGetProfileContent({ profileData, type }: IDeleteImage) {
  if (!profileData) return null;

  const { name, description, links, createdAt, background, avatar } = profileData;

  /* TODO: the following mapping won't be necessary once the default value for label is set as undefined rater than null on ceramic side*/
  const linksObj = links.map(link => ({
    href: link.href,
    label: link?.label || undefined,
  }));

  const backgroundObj = background
    ? {
        default: background.default,
        alternatives:
          /* TODO: the following logical or won't be necessary once the default value is set as undefined rater than null on ceramic side*/
          background?.alternatives || undefined,
      }
    : undefined;

  const avatarObj = avatar
    ? {
        default: avatar.default,
        alternatives:
          /* TODO: the following logical or won't be necessary once the default value is set as undefined rater than null on ceramic side*/
          avatar?.alternatives || undefined,
      }
    : undefined;

  const profileContent: PartialAkashaProfileInput = {
    name,
    description,
    links: linksObj,
    createdAt,
    background: backgroundObj,
    avatar: avatarObj,
  };

  switch (type) {
    case 'avatar':
      delete profileContent.avatar;
      return profileContent;
    case 'cover-image':
      delete profileContent.background;
      return profileContent;
  }
}
