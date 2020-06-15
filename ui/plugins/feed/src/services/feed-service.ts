import { genEntryData, genEthAddress } from '../services/dummy-data';
import { IGetFeedOptions, FeedState } from '../state/entry-state';

export interface IFeedItem {
  entryId: string;
  [key: string]: any;
}

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
        entryId: genEthAddress(),
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
  return Promise.resolve(null);
};
