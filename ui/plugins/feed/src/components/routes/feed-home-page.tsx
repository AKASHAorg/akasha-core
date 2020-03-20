import DS from '@akashaproject/design-system';
import * as React from 'react';
import { match } from 'react-router-dom';
import { useFeed } from '../../state/feed';
import EntryCard from '@akashaproject/design-system/lib/components/Cards/entry-cards/entry-card';

const { Box, VirtualList, EditorCard } = DS;

export interface IFeedHomePageProps {
  rootPath: string;
  match: match<any> | null;
}
const noop = () => {
  // tslint:disable-next-line: no-console
  console.log('not implemented!');
};
const FeedHomePage: React.FC<IFeedHomePageProps> = () => {
  const [feedState, feedActions] = useFeed();

  return (
    <Box fill={true}>
      <VirtualList
        items={feedState.items}
        itemsData={feedState.itemData}
        loadInitialFeedAction={feedActions.getFeedItems}
        loadMoreAction={feedActions.getFeedItems}
        loadItemDataAction={feedActions.getFeedItemData}
        initialPaddingTop={250}
        getItemCard={({ itemData }) => (
          <EntryCard
            entryData={itemData}
            onClickAvatar={noop}
            onClickDownvote={noop}
            onClickUpvote={noop}
            commentsLabel="Comments"
            quotesLabel="Quotes"
            quotedByLabel="Quoted by"
            shareLabel="Share"
            editPostLabel="Edit Post"
            editCommentLabel="Edit Comment"
            copyLinkLabel="Copy Link"
            replyLabel="Reply"
            loggedProfileEthAddress="0x00123"
            locale="en"
            commentInputPlaceholderLabel="Comment"
            commentInputPublishLabel="Publish Comment"
            publishComment={noop}
            style={{ height: 'auto' }}
          />
        )}
        customEntities={[
          {
            position: 'before',
            // itemIndex: 0,
            itemId: feedState.items.length ? feedState.items[0].entryId : null,
            getComponent: ({ key, style }: { key: string; style: any }) => (
              <EditorCard
                ethAddress={'0x123'}
                publishLabel="Publish"
                placeholderLabel="Write something"
                onPublish={() => null}
                style={style}
                key={key}
              />
            ),
          },
        ]}
      />
    </Box>
  );
};

export default FeedHomePage;
