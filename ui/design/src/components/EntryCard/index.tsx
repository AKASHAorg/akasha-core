import * as React from 'react';
import { BasicCardBox } from './basic-card-box';
import { SocialBox } from './social-box';
import { IEntryBoxProps, EntryBox } from './entry-box';
import { NavigateToParams } from '@akashaorg/typings/ui';

export interface IEntryCardProps extends IEntryBoxProps {
  // labels
  repostedThisLabel?: string;
  andLabel?: string;
  othersLabel?: string;
  // external css
  className?: string;
  style?: React.CSSProperties;
  rootNodeRef?: React.Ref<HTMLDivElement>;
  contentClickable?: boolean;
  noBorder?: boolean;
  noBorderRadius?: boolean;
  bottomBorderOnly?: boolean;
  accentBorderTop?: boolean;
  navigateTo?: (args: NavigateToParams) => void;
  hideRepost?: boolean;
}

const EntryCard: React.FC<IEntryCardProps> = props => {
  const {
    entryData,
    sharePostLabel,
    shareTextLabel,
    sharePostUrl,
    repostedThisLabel,
    andLabel,
    othersLabel,
    onClickAvatar,
    repliesLabel,
    repostLabel,
    repostWithCommentLabel,
    shareLabel,
    copyLinkLabel,
    locale,
    loggedProfileId,
    style,
    className,
    rootNodeRef,
    showMore,
    profileAnchorLink,
    repliesAnchorLink,
    onRepost,
    onEntryFlag,
    onMentionClick,
    onTagClick,
    navigateTo,
    onContentClick,
    handleFollowAuthor,
    handleUnfollowAuthor,
    isFollowingAuthor,
    flagAsLabel,
    contentClickable,
    disableReposting,
    disableReporting,
    hidePublishTime,
    headerTextLabel,
    footerTextLabel,
    moderatedContentLabel,
    ctaLabel,
    handleFlipCard,
    isModerated,
    scrollHiddenContent,
    disableActions,
    hideActionButtons,
    removeEntryLabel,
    isRemoved,
    onEntryRemove,
    removedByMeLabel,
    removedByAuthorLabel,
    modalSlotId,
    noBorder,
    noBorderRadius,
    bottomBorderOnly,
    accentBorderTop,
    hideRepost,
    error,
    onRetry,
  } = props;

  return (
    <BasicCardBox
      className={className}
      style={style}
      rootNodeRef={rootNodeRef}
      noBorder={noBorder}
      noBorderRadius={noBorderRadius}
      bottomBorderOnly={bottomBorderOnly}
      accentBorderTop={accentBorderTop}
    >
      {entryData.quotedByAuthors && entryData.quotedByAuthors.length > 0 && (
        <SocialBox
          socialData={entryData.quotedByAuthors}
          repostedThisLabel={repostedThisLabel}
          andLabel={andLabel}
          othersLabel={othersLabel}
          onClickUser={onMentionClick}
        />
      )}
      <EntryBox
        entryData={entryData}
        sharePostLabel={sharePostLabel}
        shareTextLabel={shareTextLabel}
        sharePostUrl={sharePostUrl}
        onClickAvatar={onClickAvatar}
        repostLabel={repostLabel}
        repostWithCommentLabel={repostWithCommentLabel}
        repliesLabel={repliesLabel}
        shareLabel={shareLabel}
        flagAsLabel={flagAsLabel}
        copyLinkLabel={copyLinkLabel}
        locale={locale}
        loggedProfileId={loggedProfileId}
        showMore={showMore}
        profileAnchorLink={profileAnchorLink}
        repliesAnchorLink={repliesAnchorLink}
        onRepost={onRepost}
        onEntryFlag={onEntryFlag}
        handleFollowAuthor={handleFollowAuthor}
        handleUnfollowAuthor={handleUnfollowAuthor}
        isFollowingAuthor={isFollowingAuthor}
        onContentClick={onContentClick}
        onMentionClick={onMentionClick}
        onTagClick={onTagClick}
        navigateTo={navigateTo}
        contentClickable={contentClickable}
        disableReposting={disableReposting}
        disableReporting={disableReporting}
        hidePublishTime={hidePublishTime}
        headerTextLabel={headerTextLabel}
        footerTextLabel={footerTextLabel}
        moderatedContentLabel={moderatedContentLabel}
        ctaLabel={ctaLabel}
        handleFlipCard={handleFlipCard}
        isModerated={isModerated}
        scrollHiddenContent={scrollHiddenContent}
        disableActions={disableActions}
        hideActionButtons={hideActionButtons}
        removeEntryLabel={removeEntryLabel}
        onEntryRemove={onEntryRemove}
        isRemoved={isRemoved}
        removedByMeLabel={removedByMeLabel}
        removedByAuthorLabel={removedByAuthorLabel}
        modalSlotId={modalSlotId}
        headerMenuExt={props.headerMenuExt}
        actionsRightExt={props.actionsRightExt}
        hideRepost={hideRepost}
        error={error}
        onRetry={onRetry}
      />
    </BasicCardBox>
  );
};

EntryCard.defaultProps = {
  repostLabel: 'Repost',
  repostWithCommentLabel: 'Repost With Comment',
  copyLinkLabel: 'Copy Link',
  flagAsLabel: 'Report',
  shareLabel: 'Share',
};

export default EntryCard;
