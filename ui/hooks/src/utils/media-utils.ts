import getSDK from '@akashaorg/awf-sdk';
import { UserProfile_Response } from '@akashaorg/typings/sdk';
import { LinkPreview } from '@akashaorg/typings/ui';
import { lastValueFrom } from 'rxjs';

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
  if (hash) {
    ipfsLinks = sdk.services.common.ipfs.buildIpfsLinks(hash);
  }
  return ipfsLinks;
};

/**
 * Utility to build media links attached to a given profile
 */
export const buildProfileMediaLinks = (profile: UserProfile_Response) => {
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
    const ipfsLinks = getMediaUrl(res?.CID);
    return {
      data: {
        originalSrc: URL.createObjectURL(res?.blob),
        src: { url: ipfsLinks?.originLink, fallbackUrl: ipfsLinks?.fallbackLink },
        size: res?.size,
      },
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
  const linkPreviewResp = await lastValueFrom(sdk.api.entries.getLinkPreview(url));
  const linkPreview: LinkPreview = Object.assign(
    linkPreviewResp.data.getLinkPreview,
    imageSources,
    faviconSources,
  );
  // add url if it's missing from the response
  if (!linkPreview.url) {
    linkPreview.url = url;
  }
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
  linkPreview.imageSources = imageSources;
  linkPreview.faviconSources = faviconSources;
  return linkPreview;
};
