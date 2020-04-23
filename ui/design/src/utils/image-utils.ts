import { isBase64, isBlob } from './string-utils';

export const formatImageSrc = (src?: string, isUrl?: boolean, ipfsUrlPrefix?: string) => {
  // src can be an ipfs CID (string) or a file blob (string)
  if (src) {
    const isIpfsHash = !isUrl && !isBase64(src) && !isBlob(src);
    const isUrlImage = typeof src === 'string' && isUrl && !isBase64(src) && !isBlob(src);
    const isFileBlob = isBlob(src) && isUrl && !isBase64(src);

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
      case isFileBlob:
        return {
          src,
          isUrl,
          prefix: '',
        };
      default:
        // tslint:disable-next-line: no-console
        console.error('Unknown image type', src);
        return {
          src,
          isUrl,
          prefix: ipfsUrlPrefix,
        };
    }
  }
  return {
    src: null,
    isUrl: false,
    prefix: null,
  };
};

export const getImageSrc = (image: { src: string; isUrl: boolean; prefix: string }) => {
  const { src, isUrl, prefix } = image;
  if (isUrl) {
    if (src.startsWith('blob:http')) {
      return src;
    }
    return `${src}`;
  }
  return `${prefix}${src}`;
};
