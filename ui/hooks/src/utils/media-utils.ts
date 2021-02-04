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
