import * as React from 'react';
import { ILocale } from '../../utils/time';
import { IEntryData } from './entry-box';
import { BasicCardBox, EntryBox } from './index';

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
  locale?: ILocale;
  commentInputPlaceholderTitle: string;
  commentInputPublishTitle: string;
  publishComment: any;
  userAvatar: string;
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
    locale,
    commentInputPlaceholderTitle,
    commentInputPublishTitle,
    publishComment,
    userAvatar,
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
        locale={locale}
        commentInputPlaceholderTitle={commentInputPlaceholderTitle}
        commentInputPublishTitle={commentInputPublishTitle}
        userAvatar={userAvatar}
        publishComment={publishComment}
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
            comment={true}
            locale={locale}
          />
        ))}
    </BasicCardBox>
  );
};

export default EntryCard;
