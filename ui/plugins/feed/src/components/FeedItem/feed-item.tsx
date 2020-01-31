import DS from '@akashaproject/design-system';
import * as React from 'react';
import { useFeed } from '../../state/feed';

const { EntryCard } = DS;

export interface IFeedItemProps {
  entryId: string;
  className?: string;
}

const noop = () => {
  // tslint:disable-next-line: no-console
  console.log('not implemented!');
};

const FeedItem: React.FC<IFeedItemProps> = props => {
  const [feedState, feedActions] = useFeed();
  const entryData = feedState.itemData[props.entryId];

  feedActions.getFeedItemData({ entryId: props.entryId });

  if (!entryData) {
    return null;
  }
  return (
    <EntryCard
      entryData={entryData}
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
      className={props.className}
    />
  );
};

export default FeedItem;
