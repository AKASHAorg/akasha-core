import * as React from 'react';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import { SocialBox } from '../../SocialBox';
import EntryBox, { IEntryBoxProps } from '../EntryBox';
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
  border?: boolean;
  noBorderRadius?: boolean;
  bottomBorderOnly?: boolean;
  accentBorderTop?: boolean;
  navigateTo?: (args: NavigateToParams) => void;
  hideRepost?: boolean;
}

const EntryCard: React.FC<IEntryCardProps> = props => {
  const {
    entryData,
    repostedThisLabel,
    andLabel,
    othersLabel,
    onClickAvatar,
    locale,
    loggedProfileEthAddress,
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
  } = props;

  return (
    <BasicCardBox
      rootNodeRef={rootNodeRef}
      border={border}
      noBorderRadius={noBorderRadius}
      pad="p-0"
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
        onClickAvatar={onClickAvatar}
        flagAsLabel={flagAsLabel}
        loggedProfileEthAddress={loggedProfileEthAddress}
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
  flagAsLabel: 'Report',
};

export default EntryCard;
