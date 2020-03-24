import DS from '@akashaproject/design-system';
import * as React from 'react';
import { match } from 'react-router-dom';
import { useFeedState, useFeedUpdate } from '../../state/feed';

const { Box, VirtualList, EditorCard, EntryCard } = DS;

export interface IFeedHomePageProps {
  rootPath: string;
  match: match<any> | null;
  singleSpa: any;
}
const noop = () => {
  // tslint:disable-next-line: no-console
  console.log('not implemented!');
};
const FeedHomePage: React.FC<IFeedHomePageProps> = props => {
  const feedState = useFeedState();
  const feedActions = useFeedUpdate();
  const [listState, setListState] = React.useState({
    scrollState: {},
    initialPayload: {},
    initialState: {
      startId: null,
      hasNewerEntries: true,
    },
  });
  const loadInitialFeed = (payload: any) => {
    setListState({
      ...listState,
      initialPayload: payload,
    });
  };

  const loadMore = (payload: any) => {
    feedActions.getFeedItems(payload);
  };
  const loadItemData = (payload: any) => {
    feedActions.getFeedItemData(payload);
  };

  feedActions.getFeedItems(listState.initialPayload, [listState.initialPayload]);
  const handleAvatarClick = () => {
    props.singleSpa.navigateToUrl('/profile/0x00123123123');
  };
  return (
    <Box fill={true}>
      <VirtualList
        items={feedState.items}
        itemsData={feedState.itemData}
        loadInitialFeed={loadInitialFeed}
        loadMore={loadMore}
        loadItemData={loadItemData}
        initialPaddingTop={250}
        initialState={listState.initialState}
        getItemCard={({ itemData }) => (
          <EntryCard
            entryData={itemData}
            onClickAvatar={handleAvatarClick}
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
