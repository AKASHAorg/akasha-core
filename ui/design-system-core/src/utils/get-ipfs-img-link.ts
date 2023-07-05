export const ipfsGatewayLink = 'ipfs.dweb.link';

export const getIpfsImgLink = (url: string) => {
  const ipfsHash = url.split('://')[1];

  return `https://${ipfsHash}.${ipfsGatewayLink}`;
};
