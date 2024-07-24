import { AkashaProfileInput } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { ProfileImageType } from '@akashaorg/typings/lib/ui';

interface IDeleteImage {
  profileData?: AkashaProfileInput;
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
        default: background?.default
          ? {
              height: background.default.height,
              width: background.default.width,
              src: background.default.src,
            }
          : undefined,
        alternatives:
          /* TODO: the following logical or won't be necessary once the default value is set as undefined rater than null on ceramic side*/
          background?.alternatives || undefined,
      }
    : undefined;

  const avatarObj = avatar
    ? {
        default: avatar?.default
          ? {
              height: avatar.default.height,
              width: avatar.default.width,
              src: avatar.default.src,
            }
          : undefined,
        alternatives:
          /* TODO: the following logical or won't be necessary once the default value is set as undefined rater than null on ceramic side*/
          avatar?.alternatives || undefined,
      }
    : undefined;

  const profileContent: AkashaProfileInput = {
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
