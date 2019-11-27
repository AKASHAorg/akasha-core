import * as React from 'react';
import { ILocale } from '../../utils/time';
import { IEntryData } from './entry-box';
import { BasicCardBox, EntryBox } from './index';

export interface IEntryCardProps {
  className?: string;
  entryData: IEntryData;
  onClickAvatar: React.MouseEventHandler<any>;
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
  locale: ILocale;
  commentInputPlaceholderTitle: string;
  commentInputPublishTitle: string;
  publishComment: any;
  loggedProfileAvatar?: string;
  loggedProfileEthAddress: string;
}

const EntryCard: React.FC<IEntryCardProps> = props => {
  const {
    className,
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
    loggedProfileAvatar,
    loggedProfileEthAddress,
  } = props;

  return (
    <BasicCardBox className={className}>
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
        loggedProfileAvatar={loggedProfileAvatar}
        loggedProfileEthAddress={loggedProfileEthAddress}
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
            loggedProfileAvatar={loggedProfileAvatar}
            loggedProfileEthAddress={loggedProfileEthAddress}
            comment={true}
            locale={locale}
          />
        ))}
    </BasicCardBox>
  );
};

export default EntryCard;
