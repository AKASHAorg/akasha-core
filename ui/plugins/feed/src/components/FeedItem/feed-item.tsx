// import DS from '@akashaproject/design-system';
import * as React from 'react';
import { IEntryData } from '@akashaproject/design-system/lib/components/Cards/entry-cards/entry-box';

// const { EntryCard } = DS;

export interface IFeedItemProps {
  item: { entryId: string };
  className?: string;
  itemData: IEntryData;
  loadData: ({ entryId }: { entryId: string }) => void;
}

// const noop = () => {
//   // tslint:disable-next-line: no-console
//   console.log('not implemented!');
// };

const FeedItem: React.FC<IFeedItemProps> = props => {
  // props.loadData({ entryId: props.item.entryId });
  const entryData = props.itemData;

  if (!entryData) {
    return null;
  }

  return (
    <></>
    // <EntryCard
    //   entryData={entryData}
    //   onClickAvatar={noop}
    //   onClickDownvote={noop}
    //   onClickUpvote={noop}
    //   commentsLabel="Comments"
    //   quotesLabel="Quotes"
    //   quotedByLabel="Quoted by"
    //   shareLabel="Share"
    //   editPostLabel="Edit Post"
    //   editCommentLabel="Edit Comment"
    //   copyLinkLabel="Copy Link"
    //   replyLabel="Reply"
    //   loggedProfileEthAddress="0x00123"
    //   locale="en"
    //   commentInputPlaceholderLabel="Comment"
    //   commentInputPublishLabel="Publish Comment"
    //   publishComment={noop}
    //   className={props.className}
    // />
  );
};

export default FeedItem;
