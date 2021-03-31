import { forkJoin } from 'rxjs';

export interface IConfig {
  quality?: number;
  maxWidth: number;
  maxHeight: number;
  autoRotate?: boolean;
  mimeType?: string;
}

export const getMediaUrl = (ipfsGateway: string, hash?: string, data?: any) => {
  let ipfsUrl = '';

  if (hash && !data) {
    ipfsUrl = `${ipfsGateway}/${hash}`;
  }

  if (data) {
    let imageSize = '';
    for (const size in data) {
      if (data.hasOwnProperty(size)) {
        imageSize = size;
        break;
      }
    }
    if (imageSize) {
      ipfsUrl = `${ipfsGateway}/${hash}/${imageSize}/src`;
    }
  }

  return ipfsUrl;
};

export const uploadMediaToTextile = (profileStore: any, ipfsSettings: any) => async (
  data: any,
  isUrl = false,
) => {
  const gatewayCall = ipfsSettings.getSettings({});
  const uploadData: {
    isUrl: boolean;
    content: any;
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
  const uploadCall = profileStore.saveMediaFile(uploadData);
  try {
    const res: any = await forkJoin([gatewayCall, uploadCall]).toPromise();
    return {
      data: { src: `${res[0].data}/${res[1].data?.CID}`, size: res[1].data?.size },
    };
  } catch (error) {
    return {
      error: error,
    };
  }
};
