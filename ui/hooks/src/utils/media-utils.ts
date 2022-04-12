import getSDK from '@akashaproject/awf-sdk';
import { lastValueFrom } from 'rxjs';

export interface IConfig {
  quality?: number;
  maxWidth: number;
  maxHeight: number;
  autoRotate?: boolean;
  mimeType?: string;
}

/**
 * Utility to append an ipfs gateway to an ipfs hash
 */
export const getMediaUrl = (hash?: string) => {
  const sdk = getSDK();
  let ipfsUrl;
  if (hash) {
    ipfsUrl = sdk.services.common.ipfs.buildOriginLink(hash);
  }
  return ipfsUrl;
};

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
    return {
      data: { src: getMediaUrl(res?.CID), size: res?.size },
    };
  } catch (error) {
    return {
      error: error,
    };
  }
};

export const getLinkPreview = async (url: string) => {
  const sdk = getSDK();
  const linkPreview = await lastValueFrom(sdk.api.entries.getLinkPreview(url));
  return linkPreview.data.getLinkPreview;
};
