import { IEntryData } from '@akashaproject/design-system/lib/components/Cards/entry-cards/entry-box';
import { genEntryData, genEthAddress, delay } from './dummy-data';

interface IGetFeedOptions {
  start?: string;
  limit: number;
  reverse?: boolean;
}

interface IFeedItem {
  entryId: string;
  [key: string]: any;
}
const ethGenerator = genEthAddress();

export const fetchFeedItems = (
  payload: IGetFeedOptions,
  filters?: any,
): Promise<{ items: IFeedItem[]; reverse?: boolean; start?: any }> => {
  const { limit } = payload;
  let items: IFeedItem[] = [];
  if (limit) {
    items = Array(limit)
      .fill({ entryId: '' })
      .map(() => ({
        entryId: ethGenerator(),
      }));
    if (filters && filters.filter) {
      switch (filters.filter) {
        case 'top_commented':
          items.sort((a, b) => a.repostCount - b.repostCount);
          break;
        case 'top_reposted':
          items.sort((a, b) => a.commentsCount - b.commentsCount);
          break;
      }
    }
    if (filters && filters.sort) {
      switch (filters.sort) {
        case 'latest':
          items.sort((a, b) => a.time - b.time);
          break;
        case 'oldest':
          items.sort((a, b) => a.time - b.time);
          break;
      }
    }
  }
  return Promise.resolve({
    items,
    reverse: payload.reverse,
    start: payload.start,
  });
};

export const fetchFeedItemData = (payload: { entryId: string }): Promise<IEntryData> => {
  const { entryId } = payload;
  return delay(100).then(() => {
    return genEntryData(entryId);
  });
};
