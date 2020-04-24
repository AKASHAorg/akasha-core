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

export const create3BoxImage = (ipfsHash?: string | null) => {
  // for deleted images or unchanged images we can get null or undefined
  if (!ipfsHash) {
    return ipfsHash as undefined | null;
  }
  const image: IBoxImage[] = [];
  if (ipfsHash) {
    image.push({ contentUrl: { '/': ipfsHash }, '@type': 'ImageObject' });
  }
  return image;
};
