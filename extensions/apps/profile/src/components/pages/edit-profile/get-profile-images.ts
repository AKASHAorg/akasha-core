import {
  PartialAkashaProfileInput,
  ProfileImageVersions,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';

export const getAvatarImage = (
  newAvatarImage: ProfileImageVersions,
  isImageDeleted: boolean,
): Pick<PartialAkashaProfileInput, 'avatar'> => {
  if (newAvatarImage) {
    return { avatar: newAvatarImage };
  }
  if (isImageDeleted) {
    return { avatar: null };
  }
  //empty object implies avatar image hasn't changed
  return {};
};

export const getCoverImage = (
  newCoverImage: ProfileImageVersions,
  isImageDeleted: boolean,
): Pick<PartialAkashaProfileInput, 'background'> => {
  if (newCoverImage) {
    return { background: newCoverImage };
  }
  if (isImageDeleted) {
    return { background: null };
  }
  //empty object implies cover image hasn't changed
  return {};
};
