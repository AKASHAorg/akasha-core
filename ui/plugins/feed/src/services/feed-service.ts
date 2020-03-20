import { genEntryData, genEthAddress } from '../services/dummy-data';

export const fetchFeedItems = (payload: {
  start: string | null;
  limit: number | null;
  reverse: boolean | null;
}) => {
  const { limit } = payload;
  let items: {}[] = [];
  if (limit) {
    items = Array(limit)
      .fill({ entryId: '' })
      .map(() => ({
        entryId: genEthAddress(),
      }));
  }
  return Promise.resolve({
    items,
    reverse: payload.reverse,
    start: payload.start,
  });
};

export const fetchFeedItemData = (payload: { entryId: string }) => {
  const { entryId } = payload;
  if (entryId) {
    return Promise.resolve(genEntryData(entryId));
  }
  return Promise.resolve(null);
};
