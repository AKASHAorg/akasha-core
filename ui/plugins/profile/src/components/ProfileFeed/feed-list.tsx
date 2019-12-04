import * as React from 'react';
import { FeedItem } from './feed-item';

export interface FeedListProps {
  feed: any;
}

export const FeedList = (props: FeedListProps) => {
  return (
    <div>
      {props.feed.items.map((item: any, idx: number) => {
        return (
          <React.Suspense fallback={<div>Loading Feed item</div>} key={`${item.id}-${idx}`}>
            <FeedItem item={item} />
          </React.Suspense>
        );
      })}
    </div>
  );
};
