import {
  PartialAkashaProfileInput,
  ProfileImageVersions,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';

export const getAvatarImage = (
  newAvatarImage: ProfileImageVersions | null,
  isImageDeleted: boolean,
): Pick<PartialAkashaProfileInput, 'avatar'> => {
  if (isImageDeleted) {
    return { avatar: null };
  }
  return newAvatarImage
    ? { avatar: newAvatarImage }
    : //empty object implies avatar image hasn't changed
      {};
};

export const getCoverImage = (
  newCoverImage: ProfileImageVersions | null,
  isImageDeleted: boolean,
): Pick<PartialAkashaProfileInput, 'background'> => {
  if (isImageDeleted) {
    return { background: null };
  }
  return newCoverImage
    ? { background: newCoverImage }
    : //empty object implies cover image hasn't changed
      {};
};
