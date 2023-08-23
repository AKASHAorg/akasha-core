import * as React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import SocialBox from '../../SocialBox';
import EntryBox, { EntryBoxProps } from '../EntryBox';
import { NavigateToParams } from '@akashaorg/typings/ui';

export type EntryCardProps = EntryBoxProps & {
  // labels
  repostedThisLabel?: string;
  andLabel?: string;
  othersLabel?: string;
  // external css
  className?: string;
  style?: React.CSSProperties;
  ref?: React.Ref<HTMLDivElement>;
  contentClickable?: boolean;
  border?: boolean;
  noBorderRadius?: boolean;
  bottomBorderOnly?: boolean;
  accentBorderTop?: boolean;
  navigateTo?: (args: NavigateToParams) => void;
  hideRepost?: boolean;
};

const EntryCard: React.FC<EntryCardProps> = props => {
  const {
    entryData,
    repostedThisLabel,
    andLabel,
    othersLabel,
    onClickAvatar,
    locale,
    ref,
    showMore,
    profileAnchorLink,
    repliesAnchorLink,
    onRepost,
    onEntryFlag,
    onMentionClick,
    onTagClick,
    navigateTo,
    onContentClick,
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
    border,
    noBorderRadius,
    // bottomBorderOnly,
    // accentBorderTop,
    hideRepost,
    error,
    onRetry,
    headerMenuExt,
    actionsRightExt,
  } = props;

  return (
    <Card ref={ref} border={border} noBorderRadius={noBorderRadius} padding="p-0">
      {/* {entryData.quotedByAuthors && entryData.quotedByAuthors.length > 0 && (
        <SocialBox
          socialData={entryData.quotedByAuthors}
          repostedThisLabel={repostedThisLabel}
          andLabel={andLabel}
          othersLabel={othersLabel}
          onClickUser={onMentionClick}
        />
      )} */}
      <EntryBox
        entryData={entryData}
        onClickAvatar={onClickAvatar}
        flagAsLabel={flagAsLabel}
        showMore={showMore}
        locale={locale}
        profileAnchorLink={profileAnchorLink}
        repliesAnchorLink={repliesAnchorLink}
        onRepost={onRepost}
        onEntryFlag={onEntryFlag}
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
        headerMenuExt={headerMenuExt}
        actionsRightExt={actionsRightExt}
        hideRepost={hideRepost}
        error={error}
        onRetry={onRetry}
      />
    </Card>
  );
};

EntryCard.defaultProps = {
  flagAsLabel: 'Report',
};

export default EntryCard;
