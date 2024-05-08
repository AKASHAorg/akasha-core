import getSDK from '@akashaorg/awf-sdk';
import { UserProfileFragmentDataFragment } from '@akashaorg/typings/lib/sdk/graphql-operation-types';
import { logError } from './error-handler';
import { type Image } from '@akashaorg/typings/lib/ui';

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
 * Utility to get preview of a specified url
 */
export const getLinkPreview = async () => {
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
  content: File | Buffer | ArrayBuffer | string;
  isUrl: boolean;
}

/**
 * Utility to save media file
 */
export const saveMediaFile = async ({ name, content, isUrl }: ISaveMediaFile) => {
  const sdk = getSDK();
  try {
    return await sdk.api.profile.saveMediaFile({
      isUrl,
      content,
      name,
    });
  } catch (ex) {
    logError('saveMediaFile', ex);
    return null;
  }
};

/**
 * Utility to transform source
 */
export const transformSource = (image?: Image): Image => {
  if (!image || typeof image?.src !== 'string' || image?.src.length === 0) return null;

  const defaultUrl = getMediaUrl(image.src);

  return {
    ...image,
    src: defaultUrl.originLink || defaultUrl.fallbackLink,
  };
};
