import { forkJoin } from 'rxjs';

export interface IConfig {
  quality?: number;
  maxWidth: number;
  maxHeight: number;
  autoRotate?: boolean;
  mimeType?: string;
}

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
