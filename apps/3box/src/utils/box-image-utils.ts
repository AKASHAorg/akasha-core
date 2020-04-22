export interface IBoxImage {
  '@type': string;
  contentUrl: {
    '/': string;
  };
}

export const getImageProperty = (image: string | IBoxImage[]): string => {
  if (Array.isArray(image) && image[0].hasOwnProperty('contentUrl')) {
    return image[0].contentUrl['/'];
  }

  if (typeof image === 'string') {
    return image;
  }
  return '';
};

export const create3BoxImage = (ipfsHash: string) => {
  const image: IBoxImage[] = [];
  if (ipfsHash) {
    image.push({ contentUrl: { '/': ipfsHash }, '@type': 'ImageObject' });
  }
  return image;
};
