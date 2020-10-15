export const computeLimit = (clientHeight: number, offsetItems: number, avgItemHeight: number) => {
  const bufferSize = offsetItems * avgItemHeight;
  const heightToFill = clientHeight + bufferSize;
  return Math.ceil(heightToFill / avgItemHeight);
};
