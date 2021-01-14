import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { IMAGE_UTILS_SERVICE } from './constants';
import { readAndCompressImage } from 'browser-image-resizer';

const service: AkashaService = (invoke, log) => {
  const getImageSize = async (
    source: File | Blob | string,
  ): Promise<{ width: number; height: number; naturalWidth: number; naturalHeight: number }> => {
    return new Promise((resolve, reject) => {
      const url = typeof source === 'string' ? source : URL.createObjectURL(source);
      if (!url) {
        throw new Error('Not a valid image source!');
      }
      const img = new Image();
      img.onload = function () {
        if (typeof source !== 'string') {
          URL.revokeObjectURL(url);
        }
        resolve({
          width: img.width,
          height: img.height,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
        });
        img.remove();
      };
      img.onerror = function (err) {
        if (typeof source !== 'string') {
          URL.revokeObjectURL(url);
        }
        reject(err);
      };
      img.src = url;
    });
  };

  const resizeImage = async (args: {
    file: File | Blob;
    config: {
      quality?: number;
      maxWidth: number;
      maxHeight: number;
      autoRotate?: boolean;
      mimeType?: string;
    };
  }) => {
    if (!args.config?.quality) {
      args.config.quality = 0.7;
    }
    const img = await readAndCompressImage(args.file, args.config);
    const size = await getImageSize(img);
    return { image: img, size: size };
  };
  return { resizeImage, getImageSize };
};

export default { service, name: IMAGE_UTILS_SERVICE };
