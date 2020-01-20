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
  commentsLabel: string;
  quotesLabel: string;
  shareLabel: string;
  editPostLabel: string;
  editCommentLabel: string;
  copyLinkLabel: string;
  quotedByLabel: string;
  replyLabel: string;
  fullEntry?: boolean;
  locale: ILocale;
  commentInputPlaceholderLabel: string;
  commentInputPublishLabel: string;
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
    commentsLabel,
    quotesLabel,
    shareLabel,
    editPostLabel,
    editCommentLabel,
    copyLinkLabel,
    quotedByLabel,
    replyLabel,
    fullEntry,
    locale,
    commentInputPlaceholderLabel,
    commentInputPublishLabel,
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
        commentsLabel={commentsLabel}
        quotesLabel={quotesLabel}
        shareLabel={shareLabel}
        editPostLabel={editPostLabel}
        editCommentLabel={editCommentLabel}
        copyLinkLabel={copyLinkLabel}
        quotedByLabel={quotedByLabel}
        replyLabel={replyLabel}
        locale={locale}
        commentInputPlaceholderLabel={commentInputPlaceholderLabel}
        commentInputPublishLabel={commentInputPublishLabel}
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
            commentsLabel={commentsLabel}
            quotesLabel={quotesLabel}
            shareLabel={shareLabel}
            editPostLabel={editPostLabel}
            editCommentLabel={editCommentLabel}
            copyLinkLabel={copyLinkLabel}
            quotedByLabel={quotedByLabel}
            replyLabel={replyLabel}
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
