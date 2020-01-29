import * as React from 'react';
import { FeedItem } from './feed-item';
import DS from '@akashaproject/design-system';

const { Box, styled } = DS;
export interface FeedListProps {
  feed: any;
}
const EntryCard = styled(FeedItem)`
  margin-bottom: 0.5em;
`;

export const FeedList = (props: FeedListProps) => {
  return (
    <Box>
      {props.feed.items.map((item: any, idx: number) => {
        return (
          <React.Suspense fallback={<div>Loading Feed item</div>} key={`${item.id}-${idx}`}>
            <EntryCard item={item} />
          </React.Suspense>
        );
      })}
    </Box>
  );
};
