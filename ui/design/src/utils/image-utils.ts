import { isBase64 } from './string-utils';

export const formatImageSrc = (
  src?: string | ArrayBuffer,
  isUrl?: boolean,
  ipfsUrlPrefix?: string,
) => {
  // src can be an ipfs CID, an arrayBuffer or an url (string)
  if (src) {
    const isIpfsHash = !Boolean(src instanceof ArrayBuffer) && !isUrl && !isBase64(src as string);
    const isUrlImage = typeof src === 'string' && isUrl && isBase64(src);
    const isArrayBuffer = Boolean(src instanceof ArrayBuffer) && !isUrl;

    switch (true) {
      case isIpfsHash:
        return {
          src,
          isUrl,
          prefix: ipfsUrlPrefix,
        };
      case isUrlImage:
        return {
          src,
          isUrl,
          prefix: '',
        };
      case isArrayBuffer:
        return {
          src,
          isUrl,
          prefix: '',
        };
      default:
        // tslint:disable-next-line: no-console
        console.error('Unknown image type');
        return {
          src,
          isUrl,
          prefix: ipfsUrlPrefix,
        };
    }
  }
  return {
    src: '',
    isUrl: false,
    prefix: '',
  };
};

export const getImageSrc = (image: {
  src: string | ArrayBuffer;
  isUrl: boolean;
  prefix: string;
}) => {
  const { src, isUrl, prefix } = image;
  if (src instanceof ArrayBuffer) {
    const arr = new Uint8Array(src);
    const blob = new Blob([arr], { type: 'image/jpeg' });
    const urlCreator = window.URL || window.webkitURL;
    const imageUrl = urlCreator.createObjectURL(blob);
    return imageUrl;
  }
  if (isUrl) {
    return src;
  }
  return `${prefix}${src}`;
};
