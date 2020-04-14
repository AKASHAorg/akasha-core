export const getImageProperty = (image: string | { contentUrl: { '/': string } }[]): string => {
  if (Array.isArray(image) && image[0].hasOwnProperty('contentUrl')) {
    return image[0].contentUrl['/'];
  }
  return image as string;
};
