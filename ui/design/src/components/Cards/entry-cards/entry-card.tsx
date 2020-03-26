import * as React from 'react';
import { ILocale } from '../../../utils/time';
import { MainAreaCardBox } from '../common/basic-card-box';
import { EntryBox } from '../index';
import { IEntryData } from './entry-box';

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
  style?: React.CSSProperties;
  rootNodeRef?: React.Ref<HTMLDivElement>;
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
    style,
    rootNodeRef,
  } = props;

  return (
    <MainAreaCardBox className={className} style={style} rootNodeRef={rootNodeRef}>
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
    </MainAreaCardBox>
  );
};

export default EntryCard;
