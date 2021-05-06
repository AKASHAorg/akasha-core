import * as React from 'react';
import { Box, Text } from 'grommet';
import styled from 'styled-components';
import { isMobile } from 'react-device-detect';

import { ISocialData } from './social-box';
import CardHeaderMenuDropdown from './card-header-menu';
import CardActions, { ServiceNames } from './card-actions';
import CardHeaderAkashaDropdown from './card-header-akasha';
import { StyledDropAlt, StyledProfileDrop, StyledIcon } from './styled-entry-box';

import { EntryCardHidden } from './entry-card-hidden';
import { ProfileMiniCard } from '../ProfileCard/profile-mini-card';
import { IProfileData } from '../ProfileCard/profile-widget-card';
import { StyledAnchor } from './basic-card-box';

import Icon from '../Icon';
import MobileListModal from '../MobileListModal';
import ProfileAvatarButton from '../ProfileAvatarButton';
import EmbedBox from '../EmbedBox';
import ReadOnlyEditor from '../ReadOnlyEditor';
import ViewportSizeProvider from '../Providers/viewport-dimension';

import { formatRelativeTime, ILocale } from '../../utils/time';

export interface IEntryData {
  CID?: string;
  content: any;
  time?: string | number | Date;
  replies?: number;
  reposts?: number;
  ipfsLink: string;
  permalink: string;
  entryId: string;
  author: IProfileData;
  quotedByAuthors?: ISocialData;
  quotedBy?: string;
  quote?: IEntryData;
  delisted?: boolean;
  reported?: boolean;
}
export interface IContentClickDetails {
  authorEthAddress: string;
  entryId: string;
  replyTo: {
    authorEthAddress: string;
    entryId: string;
  } | null;
}
export interface IEntryBoxProps {
  // data
  entryData: IEntryData;
  locale: ILocale;
  loggedProfileEthAddress?: string | null;
  // share data
  sharePostLabel?: string;
  shareTextLabel?: string;
  sharePostUrl?: string;
  // labels
  repliesLabel: string;
  repostsLabel: string;
  repostLabel?: string;
  cancelLabel?: string;
  repostWithCommentLabel?: string;
  shareLabel?: string;
  flagAsLabel?: string;
  copyLinkLabel?: string;
  comment?: boolean;
  bookmarkLabel?: string;
  bookmarkedLabel?: string;
  // anchor link
  profileAnchorLink?: string;
  repliesAnchorLink?: string;
  // handlers
  isBookmarked?: boolean;
  onEntryBookmark?: (entryId: string, isBookmarked?: boolean) => void;
  onClickAvatar?: React.MouseEventHandler<HTMLDivElement>;
  onRepost?: (withComment: boolean, entryData: IEntryData) => void;
  onEntryFlag?: (entryId?: string) => void;
  // follow related
  handleFollowAuthor?: (profileEthAddress: string) => void;
  handleUnfollowAuthor?: (profileEthAddress: string) => void;
  isFollowingAuthor?: boolean;
  // redirects
  onContentClick?: (details: IContentClickDetails) => void;
  /* Can click the content (not embed!) to navigate */
  contentClickable?: boolean;
  onMentionClick?: (pubKey: string) => void;
  onTagClick?: (name: string) => void;
  singleSpaNavigate?: (url: string) => void;
  // style
  style?: React.CSSProperties;
  disableReposting?: boolean;
  disableActions?: boolean;
  hideActionButtons?: boolean;
  hidePublishTime?: boolean;
  awaitingModerationLabel?: string;
  moderatedContentLabel?: string;
  ctaLabel?: string;
  handleFlipCard?: (entry: IEntryData, isQuote: boolean) => () => void;
  isModerated?: boolean;
  scrollHiddenContent?: boolean;
}

const StyledProfileAvatarButton = styled(ProfileAvatarButton)`
  flex-grow: 1;
  flex-shrink: 1;
`;

const EntryBox: React.FC<IEntryBoxProps> = props => {
  const {
    entryData,
    loggedProfileEthAddress,
    sharePostLabel,
    shareTextLabel,
    sharePostUrl,
    repliesLabel,
    repostsLabel,
    repostLabel,
    cancelLabel,
    repostWithCommentLabel,
    shareLabel,
    flagAsLabel,
    copyLinkLabel,
    locale,
    isBookmarked,
    bookmarkLabel,
    bookmarkedLabel,
    profileAnchorLink,
    repliesAnchorLink,
    onEntryBookmark,
    onClickAvatar,
    onRepost,
    onEntryFlag,
    handleFollowAuthor,
    handleUnfollowAuthor,
    isFollowingAuthor,
    onContentClick,
    onMentionClick,
    onTagClick,
    singleSpaNavigate,
    style,
    contentClickable,
    disableReposting,
    disableActions,
    hideActionButtons,
    hidePublishTime,
    awaitingModerationLabel,
    moderatedContentLabel,
    ctaLabel,
    handleFlipCard,
    isModerated,
    scrollHiddenContent,
  } = props;

  const [menuDropOpen, setMenuDropOpen] = React.useState(false);
  const [profileDropOpen, setProfileDropOpen] = React.useState(false);
  const [displayCID, setDisplayCID] = React.useState(false);

  const menuIconRef: React.Ref<HTMLDivElement> = React.useRef(null);
  const profileRef: React.Ref<HTMLDivElement> = React.useRef(null);
  const akashaRef: React.Ref<HTMLDivElement> = React.useRef(null);

  const closeMenuDrop = () => {
    setMenuDropOpen(false);
  };

  const toggleMenuDrop = (ev: React.SyntheticEvent) => {
    ev.stopPropagation();
    setMenuDropOpen(!menuDropOpen);
  };

  const handleEntryBookmark = () => {
    if (onEntryBookmark && entryData.entryId) {
      onEntryBookmark(entryData.entryId, isBookmarked);
    }
  };

  const handleRepost = (withComment: boolean) => () => {
    if (onRepost) {
      onRepost(withComment, entryData);
    }
  };

  const handleEntryShare = (service: ServiceNames, entryId: string) => {
    const url = `${sharePostUrl}${entryId}`;
    let shareUrl;
    switch (service) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'reddit':
        shareUrl = `http://www.reddit.com/submit?url=${url}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        break;
      default:
        break;
    }
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

  const handleEntryFlag = () => {
    if (onEntryFlag) {
      onEntryFlag(entryData.entryId);
    }
  };

  const handleRepliesClick = () => handleContentClick(entryData);

  const handleContentClick = (data?: IEntryData) => {
    if (onContentClick && typeof onContentClick === 'function' && data) {
      onContentClick({
        authorEthAddress: data.author.ethAddress,
        entryId: data.entryId,
        replyTo: null,
      });
    }
  };

  const toggleDisplayCID = () => {
    setDisplayCID(!displayCID);
  };

  return (
    <ViewportSizeProvider>
      <Box style={style}>
        <Box
          direction="row"
          justify="between"
          pad={{ top: 'medium', horizontal: 'medium' }}
          flex={{ shrink: 0 }}
        >
          <StyledAnchor
            onClick={(e: React.SyntheticEvent) => {
              e.preventDefault();
              return false;
            }}
            weight="normal"
            href={`${profileAnchorLink}/${entryData.author.pubKey}`}
            label={
              <StyledProfileAvatarButton
                label={entryData.author?.name}
                info={entryData.author?.userName && `@${entryData.author?.userName}`}
                avatarImage={entryData.author?.avatar}
                onClickAvatar={(ev: React.MouseEvent<HTMLDivElement>) => {
                  if (disableActions) {
                    return;
                  }
                  if (onClickAvatar) {
                    onClickAvatar(ev);
                  }
                }}
                onClick={(ev: React.MouseEvent<HTMLDivElement>) => {
                  if (disableActions) {
                    return;
                  }
                  if (onClickAvatar) {
                    onClickAvatar(ev);
                  }
                }}
                ethAddress={entryData.author?.ethAddress}
                ref={profileRef}
                bold={true}
                // onMouseEnter={() => setProfileDropOpen(true)}
                // onMouseLeave={() => setProfileDropOpen(false)}
              />
            }
          />
          {profileRef.current && profileDropOpen && (
            <StyledProfileDrop
              overflow="hidden"
              target={profileRef.current}
              align={{ top: 'bottom', left: 'left' }}
              onClickOutside={() => setProfileDropOpen(false)}
              onEsc={() => setProfileDropOpen(false)}
            >
              <Box
                width="20rem"
                round="small"
                flex="grow"
                onClick={onClickAvatar}
                elevation="shadow"
              >
                <ProfileMiniCard
                  loggedEthAddress={loggedProfileEthAddress}
                  profileData={entryData.author}
                  handleFollow={handleFollowAuthor}
                  handleUnfollow={handleUnfollowAuthor}
                  isFollowing={isFollowingAuthor}
                  disableFollowing={true}
                />
              </Box>
            </StyledProfileDrop>
          )}
          <Box direction="row" gap="xsmall" align="center" flex={{ shrink: 0 }}>
            {entryData.time && !hidePublishTime && (
              <Text style={{ flexShrink: 0 }} color="secondaryText">
                {formatRelativeTime(entryData.time, locale)}
              </Text>
            )}
            <Icon
              type="akasha"
              size="sm"
              onClick={toggleDisplayCID}
              ref={akashaRef}
              clickable={false}
            />
            {/* this condition hides the icon for logged user's own posts */}
            {onEntryFlag && !(entryData.author.ethAddress === loggedProfileEthAddress) && (
              <StyledIcon
                type="moreDark"
                onClick={(ev: React.MouseEvent<HTMLDivElement>) => {
                  if (disableActions) {
                    return;
                  }
                  toggleMenuDrop(ev);
                }}
                clickable={!disableActions}
                ref={menuIconRef}
              />
            )}
          </Box>
        </Box>
        {entryData.CID && akashaRef.current && displayCID && (
          <CardHeaderAkashaDropdown
            target={akashaRef.current}
            onMenuClose={() => {
              setDisplayCID(false);
            }}
            CID={entryData.CID}
          />
        )}
        {!isMobile && menuIconRef.current && menuDropOpen && onEntryFlag && (
          <CardHeaderMenuDropdown
            target={menuIconRef.current}
            onMenuClose={closeMenuDrop}
            onFlag={handleEntryFlag}
            flagAsLabel={flagAsLabel}
          />
        )}
        {isMobile && menuDropOpen && onEntryFlag && (
          <StyledDropAlt>
            <MobileListModal
              closeModal={closeMenuDrop}
              menuItems={[
                {
                  label: props.flagAsLabel,
                  icon: 'report',
                  handler: () => handleEntryFlag(),
                },
              ]}
            />
          </StyledDropAlt>
        )}
        <Box
          pad={{ horizontal: 'medium' }}
          height={{ max: '50rem' }}
          overflow={scrollHiddenContent ? 'auto' : 'hidden'}
          style={{ cursor: contentClickable ? 'pointer' : 'default' }}
          onClick={() =>
            !disableActions && contentClickable ? handleContentClick(entryData) : false
          }
        >
          <ReadOnlyEditor
            content={entryData.content}
            handleMentionClick={onMentionClick}
            handleTagClick={onTagClick}
            handleLinkClick={singleSpaNavigate}
          />
        </Box>
        {entryData.quote && !entryData.quote.delisted && !entryData.quote.reported && (
          <Box
            pad="medium"
            onClick={() => {
              if (disableActions) {
                return;
              }
              handleContentClick(entryData.quote);
            }}
          >
            <EmbedBox embedEntryData={entryData.quote} />
          </Box>
        )}
        {entryData.quote && !entryData.quote.delisted && entryData.quote.reported && (
          <Box pad="medium" onClick={() => null}>
            <EntryCardHidden
              awaitingModerationLabel={awaitingModerationLabel}
              ctaLabel={ctaLabel}
              handleFlipCard={handleFlipCard && handleFlipCard(entryData, true)}
            />
          </Box>
        )}
        {entryData.quote && entryData.quote.delisted && (
          <Box pad="medium" onClick={() => null}>
            <EntryCardHidden moderatedContentLabel={moderatedContentLabel} isDelisted={true} />
          </Box>
        )}
        {!hideActionButtons && (
          <CardActions
            entryData={entryData}
            loggedProfileEthAddress={loggedProfileEthAddress}
            sharePostLabel={sharePostLabel}
            shareTextLabel={shareTextLabel}
            sharePostUrl={sharePostUrl}
            repliesLabel={repliesLabel}
            repostsLabel={repostsLabel}
            repostLabel={repostLabel}
            cancelLabel={cancelLabel}
            repostWithCommentLabel={repostWithCommentLabel}
            isBookmarked={isBookmarked}
            bookmarkLabel={bookmarkLabel}
            bookmarkedLabel={bookmarkedLabel}
            shareLabel={shareLabel}
            copyLinkLabel={copyLinkLabel}
            repliesAnchorLink={repliesAnchorLink}
            handleEntryBookmark={handleEntryBookmark}
            onRepost={handleRepost(false)}
            onRepostWithComment={handleRepost(true)}
            onShare={handleEntryShare}
            handleRepliesClick={handleRepliesClick}
            disableReposting={disableReposting}
            disableActions={disableActions}
            isModerated={isModerated}
          />
        )}
      </Box>
    </ViewportSizeProvider>
  );
};

export { EntryBox };
