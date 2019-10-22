import * as React from 'react';
import { EntryBox, BasicCardBox } from './index';
import { IEntryData } from './entry-box';

export interface IEntryCardProps {
  entryData: IEntryData;
  onClickAvatar: React.EventHandler<React.SyntheticEvent>;
  onClickUpvote: React.EventHandler<React.SyntheticEvent>;
  onClickDownvote: React.EventHandler<React.SyntheticEvent>;
  commentsTitle: string;
  quotesTitle: string;
  shareTitle: string;
  editPostTitle: string;
  editCommentTitle: string;
  copyLinkTitle: string;
  quotedByTitle: string;
  replyTitle: string;
  fullEntry?: boolean;
}

const EntryCard: React.FC<IEntryCardProps> = props => {
  const {
    entryData,
    onClickAvatar,
    onClickDownvote,
    onClickUpvote,
    commentsTitle,
    quotesTitle,
    shareTitle,
    editPostTitle,
    editCommentTitle,
    copyLinkTitle,
    quotedByTitle,
    replyTitle,
    fullEntry,
  } = props;

  return (
    <BasicCardBox>
      <EntryBox
        entryData={entryData}
        onClickAvatar={onClickAvatar}
        onClickDownvote={onClickDownvote}
        onClickUpvote={onClickUpvote}
        commentsTitle={commentsTitle}
        quotesTitle={quotesTitle}
        shareTitle={shareTitle}
        editPostTitle={editPostTitle}
        editCommentTitle={editCommentTitle}
        copyLinkTitle={copyLinkTitle}
        quotedByTitle={quotedByTitle}
        replyTitle={replyTitle}
      />
      {fullEntry &&
        entryData.comments &&
        entryData.comments.map((comment, index) => (
          <EntryBox
            entryData={comment}
            onClickAvatar={onClickAvatar}
            onClickDownvote={onClickDownvote}
            onClickUpvote={onClickUpvote}
            commentsTitle={commentsTitle}
            quotesTitle={quotesTitle}
            shareTitle={shareTitle}
            editPostTitle={editPostTitle}
            editCommentTitle={editCommentTitle}
            copyLinkTitle={copyLinkTitle}
            quotedByTitle={quotedByTitle}
            replyTitle={replyTitle}
            key={index}
            comment
          />
        ))}
    </BasicCardBox>
  );
};

export default EntryCard;
