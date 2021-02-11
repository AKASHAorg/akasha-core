import * as React from 'react';
import { MainAreaCardBox } from '../common/basic-card-box';
import { SocialBox } from './social-box';
import { IEntryBoxProps, EntryBox } from './entry-box';
import { Box } from 'grommet';

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
    repostsLabel,
    repostLabel,
    repostWithCommentLabel,
    shareLabel,
    copyLinkLabel,
    locale,
    loggedProfileEthAddress,
    style,
    className,
    rootNodeRef,
    onEntryBookmark,
    isBookmarked,
    bookmarkLabel,
    bookmarkedLabel,
    onRepost,
    onClickReplies,
    onEntryShare,
    onEntryFlag,
    onMentionClick,
    onContentClick,
    handleFollowAuthor,
    handleUnfollowAuthor,
    isFollowingAuthor,
    flagAsLabel,
    contentClickable,
    disableIpfsCopyLink,
    disableReposting,
    hidePublishTime,
    descriptionLabel,
    descriptionAltLabel,
    ctaLabel,
    handleFlipCard,
  } = props;

  return (
    <MainAreaCardBox className={className} style={style} rootNodeRef={rootNodeRef}>
      {entryData.quotedByAuthors && entryData.quotedByAuthors.length > 0 && (
        <SocialBox
          socialData={entryData.quotedByAuthors}
          repostedThisLabel={repostedThisLabel}
          andLabel={andLabel}
          othersLabel={othersLabel}
          onClickUser={onMentionClick}
        />
      )}
      <Box pad={{ horizontal: 'medium' }}>
        <EntryBox
          entryData={entryData}
          sharePostLabel={sharePostLabel}
          shareTextLabel={shareTextLabel}
          sharePostUrl={sharePostUrl}
          onClickAvatar={onClickAvatar}
          repostsLabel={repostsLabel}
          repostLabel={repostLabel}
          repostWithCommentLabel={repostWithCommentLabel}
          repliesLabel={repliesLabel}
          shareLabel={shareLabel}
          flagAsLabel={flagAsLabel}
          copyLinkLabel={copyLinkLabel}
          locale={locale}
          loggedProfileEthAddress={loggedProfileEthAddress}
          onEntryBookmark={onEntryBookmark}
          isBookmarked={isBookmarked}
          bookmarkLabel={bookmarkLabel}
          bookmarkedLabel={bookmarkedLabel}
          onRepost={onRepost}
          onClickReplies={onClickReplies}
          onEntryShare={onEntryShare}
          onEntryFlag={onEntryFlag}
          handleFollowAuthor={handleFollowAuthor}
          handleUnfollowAuthor={handleUnfollowAuthor}
          isFollowingAuthor={isFollowingAuthor}
          onContentClick={onContentClick}
          onMentionClick={onMentionClick}
          contentClickable={contentClickable}
          disableIpfsCopyLink={disableIpfsCopyLink}
          disableReposting={disableReposting}
          hidePublishTime={hidePublishTime}
          descriptionLabel={descriptionLabel}
          descriptionAltLabel={descriptionAltLabel}
          ctaLabel={ctaLabel}
          handleFlipCard={handleFlipCard}
        />
      </Box>
    </MainAreaCardBox>
  );
};

EntryCard.defaultProps = {
  repostsLabel: 'Reposts',
  repostLabel: 'Repost',
  repostWithCommentLabel: 'Repost With Comment',
  copyLinkLabel: 'Copy Link',
  flagAsLabel: 'Report',
  shareLabel: 'Share',
};

export { EntryCard };
