import { ProfileImageVersions } from '@akashaorg/typings/sdk/graphql-types-new';
import { getMediaUrl, saveMediaFile } from '@akashaorg/ui-awf-hooks';

export const saveAndGetImageObj = async (name: 'avatar' | 'coverImage', content?: File) => {
  if (!content) return null;

  const mediaFile = await saveMediaFile({ name, isUrl: false, content });

  if (!mediaFile) return null;

  const mediaUri = `ipfs://${mediaFile.CID}`;

  return {
    default: {
      height: mediaFile.size.height,
      width: mediaFile.size.width,
      src: mediaUri,
    },
  };
};

export const getImageObj = (image?: ProfileImageVersions): ProfileImageVersions => {
  if (!image) return null;

  const mediaUrl = getMediaUrl(image.default.src);

  return {
    default: {
      ...image.default,
      src: mediaUrl.originLink || mediaUrl.fallbackLink,
    },
    alternatives: image.alternatives,
  };
};
