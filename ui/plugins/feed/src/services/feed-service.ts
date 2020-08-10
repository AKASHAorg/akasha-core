import { genEntryData, genEthAddress } from './dummy-data';
import { IGetFeedOptions, FeedState } from '../state/feed-state';

export interface IFeedItem {
  entryId: string;
  [key: string]: any;
}

const ethGenerator = genEthAddress();

export const fetchFeedItems = (
  payload: IGetFeedOptions['options'],
  filters: FeedState['filters'],
) => {
  const { limit } = payload;
  const { filter, sort } = filters;
  let items: IFeedItem[] = [];
  if (limit) {
    items = Array(limit)
      .fill({ entryId: '' })
      .map(() => ({
        entryId: ethGenerator(),
      }));
    switch (filter) {
      case 'top_commented':
        items.sort((a, b) => a.repostCount - b.repostCount);
        break;
      case 'top_reposted':
        items.sort((a, b) => a.commentsCount - b.commentsCount);
        break;
    }
    switch (sort) {
      case 'latest':
        items.sort((a, b) => a.time - b.time);
        break;
      case 'oldest':
        items.sort((a, b) => a.time - b.time);
        break;
    }
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
  return Promise.resolve({ entryId });
};
