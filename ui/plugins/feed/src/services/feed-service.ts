import { delay, genEntryData, genEthAddress, randomMs } from '../services/dummy-data';

export const fetchFeedItems = (payload: { start: string; limit: number }) => {
  const { limit } = payload;
  const items = Array(limit)
    .fill({ entryId: '' })
    .map(() => ({
      entryId: genEthAddress(),
    }));
  return delay(randomMs(100, 1000)).then(() =>
    Promise.resolve({
      items,
    }),
  );
};

export const fetchFeedItemData = (payload: { entryId: string }) => {
  const { entryId } = payload;

  return delay(randomMs(100, 2000)).then(() => Promise.resolve(genEntryData(entryId)));
};
