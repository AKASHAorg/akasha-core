import getSDK from '@akashaorg/awf-sdk';
import { UserProfileFragmentDataFragment } from '@akashaorg/typings/lib/sdk/graphql-operation-types';
import { logError } from './error-handler';
import type { AkashaProfileImageVersions } from '@akashaorg/typings/lib/sdk/graphql-types-new';

export const MEDIA_UPLOAD_EMAIL = '@mediaUploadEmail';

export interface IConfig {
  quality?: number;
  maxWidth: number;
  maxHeight: number;
  autoRotate?: boolean;
  mimeType?: string;
}

/**
 *  Utility to build gateway links to ipfs content
 */
export const getMediaUrl = (hash?: string) => {
  const sdk = getSDK();
  let ipfsLinks:
    | {
        originLink: string;
        fallbackLink: string;
        pathLink: string;
      }
    | undefined;

  let _hash = hash;

  if (typeof hash === 'string' && hash.startsWith('ipfs://')) {
    _hash = hash.substring(7);
  }

  if (typeof hash === 'string' && hash.startsWith('/ipfs/')) {
    _hash = hash.substring(6);
  }

  if (_hash) {
    ipfsLinks = sdk.services.common.ipfs.buildIpfsLinks(_hash);
  }

  return ipfsLinks;
};

/**
 * Utility to build media links attached to a given profile
 */
export const buildProfileMediaLinks = (profile: UserProfileFragmentDataFragment) => {
  const { avatar, coverImage, ...other } = profile;
  const images: {
    avatar: { url: string; fallbackUrl: string };
    coverImage: { url: string; fallbackUrl: string };
  } = {
    avatar: { url: '', fallbackUrl: '' },
    coverImage: { url: '', fallbackUrl: '' },
  };
  if (avatar) {
    images.avatar = {
      url: getMediaUrl(avatar)?.originLink,
      fallbackUrl: getMediaUrl(avatar)?.fallbackLink,
    };
  }
  if (coverImage) {
    images.coverImage = {
      url: getMediaUrl(coverImage)?.originLink,
      fallbackUrl: getMediaUrl(coverImage)?.fallbackLink,
    };
  }
  return { ...images, ...other };
};

/**
 * Utility to upload media to textile bucket
 */
export const uploadMediaToTextile = async (data: File, isUrl = false) => {
  const sdk = getSDK();
  const uploadData: {
    isUrl: boolean;
    content: File;
    name?: string;
    config: IConfig;
  } = {
    isUrl,
    content: data,
    config: {
      quality: 0.8,
      maxWidth: 640,
      maxHeight: 640,
      autoRotate: true,
    },
  };

  if (data.type) {
    uploadData.config.mimeType = data.type;
  }

  if (data.name) {
    uploadData.name = data.name;
  }

  try {
    const res = await sdk.api.profile.saveMediaFile(uploadData);
    //const ipfsLinks = getMediaUrl(res?.CID);
    return {
      /*
      data: {
        originalSrc: URL.createObjectURL(res?.blob),
        src: { url: ipfsLinks?.originLink, fallbackUrl: ipfsLinks?.fallbackLink },
        size: res?.size,
      },
      */
    };
  } catch (error) {
    return {
      error: error,
    };
  }
};

/**
 * Utility to get preview of a specified url
 */
export const getLinkPreview = async (url: string) => {
  const sdk = getSDK();
  const imageSources = { url: '', fallbackUrl: '' };
  const faviconSources = { url: '', fallbackUrl: '' };
  const linkPreviewResp = { getLinkPreview: undefined };
  const linkPreview = Object.assign({}, linkPreviewResp.getLinkPreview);

  // fetch media links for image and favicon sources
  if (linkPreview.imagePreviewHash) {
    const ipfsLinks = getMediaUrl(linkPreview.imagePreviewHash);
    imageSources.url = ipfsLinks.originLink;
    imageSources.fallbackUrl = ipfsLinks.fallbackLink;
  }
  if (linkPreview.faviconPreviewHash) {
    const ipfsLinks = getMediaUrl(linkPreview.faviconPreviewHash);
    faviconSources.url = ipfsLinks.originLink;
    faviconSources.fallbackUrl = ipfsLinks.fallbackLink;
  }
  const sources = {
    imageSources: imageSources,
    faviconSources: faviconSources,
  };
  return Object.assign({}, linkPreview, sources);
};

interface ISaveMediaFile {
  name: string;
  content: File;
  isUrl: boolean;
  email?: string;
}

/**
 * Utility to save media file
 */
export const saveMediaFile = async ({ name, content, isUrl, email }: ISaveMediaFile) => {
  const mediaUploadEmail = email || window.localStorage.getItem(MEDIA_UPLOAD_EMAIL);

  if (
    !mediaUploadEmail ||
    !mediaUploadEmail.indexOf(
      '@',
    ) /*Check if @ symbol is somewhere besides the beginning of the string*/
  )
    return null;

  const sdk = getSDK();

  try {
    const mediaFile = await sdk.api.profile.saveMediaFile({
      isUrl,
      content,
      name,
      email: mediaUploadEmail as 'string@string',
    });
    return mediaFile;
  } catch (ex) {
    logError('saveMediaFile', ex);
    return null;
  }
};

/**
 * Utility to get profile image versions with media url
 */
export const getProfileImageVersionsWithMediaUrl = (
  image?: AkashaProfileImageVersions,
): AkashaProfileImageVersions => {
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
