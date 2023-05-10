import * as React from 'react';
import { Box, Text } from 'grommet';
import styled from 'styled-components';
import { isMobileOnly } from 'react-device-detect';
import CardHeaderMenuDropdown from './card-header-menu';
import CardActions, { ServiceNames } from './card-actions';
import CardHeaderAkashaDropdown from './card-header-akasha';
import { StyledProfileDrop } from './styled-entry-box';

import { EntryCardHidden } from './entry-card-hidden';
import { ProfileMiniCard } from '../ProfileCard/profile-mini-card';
import { StyledAnchor } from './basic-card-box';

import Icon, { IconType } from '../Icon';
import MobileListModal from '../MobileListModal';
import ProfileAvatarButton from '../ProfileAvatarButton';
import EmbedBox from '../EmbedBox';
import ReadOnlyEditor from '../ReadOnlyEditor';
import ViewportSizeProvider from '../Providers/viewport-dimension';

import { formatDate, formatRelativeTime, ILocale } from '../../utils/time';
import { IEntryData, EntityTypes, NavigateToParams } from '@akashaorg/typings/ui';
import LinkPreview from '../Editor/link-preview';
import Tooltip from '../Tooltip';
import { EntryCardRemoved } from './entry-card-removed';
import { EntryImageGallery } from '../ImageGallery/entry-image-gallery';
import { ImageObject } from '../ImageGallery/image-grid-item';
import MultipleImageOverlay from '../ImageOverlay/multiple-image-overlay';
import { editorDefaultValue } from '../Editor/initialValue';
import isEqual from 'lodash.isequal';
import { EntryCardError } from './entry-card-error';

export interface IContentClickDetails {
  authorEthAddress: string;
  id: string;
  replyTo?: {
    authorEthAddress?: string;
    itemId?: string;
  };
}

export interface IEntryBoxProps {
  // data
  entryData: IEntryData;
  locale: ILocale;
  loggedProfileId?: string | null;
  // share data
  sharePostLabel?: string;
  shareTextLabel?: string;
  sharePostUrl?: string;
  // labels
  repliesLabel: string;
  repostLabel?: string;
  cancelLabel?: string;
  repostWithCommentLabel?: string;
  shareLabel?: string;
  flagAsLabel?: string;
  copyLinkLabel?: string;
  comment?: boolean;
  editedLabel?: string;
  headerTextLabel?: string;
  footerTextLabel?: string;
  moderatedContentLabel?: string;
  ctaLabel?: string;
  removedByMeLabel?: string;
  removedByAuthorLabel?: string;
  // determines when to render the 'show more' icon
  showMore: boolean;
  // anchor link
  profileAnchorLink?: string;
  repliesAnchorLink?: string;
  // handlers
  onClickAvatar?: React.MouseEventHandler<HTMLDivElement>;
  onRepost?: (withComment: boolean, itemId: string) => void;
  onEntryFlag?: (itemId?: string, itemType?: string) => void;
  // follow related
  handleFollowAuthor?: (profileEthAddress: string) => void;
  handleUnfollowAuthor?: (profileEthAddress: string) => void;
  isFollowingAuthor?: boolean;
  // redirects
  onContentClick?: (details: IContentClickDetails, itemType?: EntityTypes) => void;
  /* Can click the content (not embed!) to navigate */
  contentClickable?: boolean;
  onMentionClick?: (pubKey: string) => void;
  onTagClick?: (name: string) => void;
  navigateTo?: (args: NavigateToParams) => void;
  // style
  style?: React.CSSProperties;
  disableReposting?: boolean;
  disableReporting?: boolean;
  disableActions?: boolean;
  hideActionButtons?: boolean;
  hidePublishTime?: boolean;
  handleFlipCard?: () => void;
  isModerated?: boolean;
  scrollHiddenContent?: boolean;
  removeEntryLabel?: string;
  onEntryRemove?: (itemId: string) => void;
  onRepliesClick?: () => void;
  isRemoved?: boolean;
  headerMenuExt?: React.ReactElement;
  modalSlotId: string;
  actionsRightExt?: React.ReactNode;
  hideRepost?: boolean;
  error?: string;
  onRetry?: () => void;
}

const StyledProfileAvatarButton = styled(ProfileAvatarButton)`
  flex-grow: 1;
  flex-shrink: 1;
`;

const EntryBox: React.FC<IEntryBoxProps> = props => {
  const {
    entryData,
    loggedProfileId,
    sharePostLabel,
    shareTextLabel,
    sharePostUrl,
    repliesLabel,
    repostLabel,
    cancelLabel,
    repostWithCommentLabel,
    shareLabel,
    flagAsLabel,
    copyLinkLabel,
    locale,
    showMore,
    profileAnchorLink,
    repliesAnchorLink,
    onClickAvatar,
    onRepost,
    onEntryFlag,
    handleFollowAuthor,
    handleUnfollowAuthor,
    isFollowingAuthor,
    onContentClick,
    onMentionClick,
    onTagClick,
    navigateTo,
    style,
    contentClickable,
    disableReposting,
    disableReporting,
    disableActions,
    hideActionButtons,
    hidePublishTime,
    headerTextLabel,
    footerTextLabel,
    moderatedContentLabel,
    ctaLabel,
    handleFlipCard,
    isModerated,
    scrollHiddenContent,
    onEntryRemove,
    removeEntryLabel,
    removedByMeLabel = 'You deleted this post',
    removedByAuthorLabel = 'This post was deleted by its author',
    editedLabel = 'Last edited',
    modalSlotId,
    actionsRightExt,
    onRepliesClick,
    hideRepost,
    error,
    onRetry,
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

  const handleRepost = (withComment: boolean) => () => {
    if (onRepost) {
      onRepost(withComment, entryData.entryId);
    }
  };

  const handleEntryShare = (service: ServiceNames, itemId: string) => {
    const url = `${sharePostUrl}${itemId}`;
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
      onEntryFlag();
    }
  };

  const handleEntryRemove = () => {
    if (onEntryRemove) {
      onEntryRemove(props.entryData.entryId);
    }
  };

  const handleRepliesClick = () => {
    handleContentClick(entryData);
    if (typeof onRepliesClick === 'function') onRepliesClick();
  };

  const handleContentClick = (data?: IEntryData) => {
    if (typeof onContentClick === 'function' && !disableActions && contentClickable && data) {
      const replyTo = data.postId ? { itemId: data.postId } : null;
      const itemType = replyTo ? EntityTypes.REPLY : EntityTypes.POST;
      onContentClick(
        {
          authorEthAddress: data.author.ethAddress,
          id: data.entryId,
          replyTo,
        },
        itemType,
      );
    }
  };

  const handleLinkClick = (url: string) => {
    navigateTo?.({ getNavigationUrl: () => url });
  };

  const toggleDisplayCID = () => {
    setDisplayCID(!displayCID);
  };

  // memoized flags
  const showCardMenu = React.useMemo(
    () => !isMobileOnly && menuIconRef.current && menuDropOpen,
    [menuDropOpen],
  );

  const showMobileCardMenu = React.useMemo(() => isMobileOnly && menuDropOpen, [menuDropOpen]);

  const showProfileDrop = React.useMemo(
    () => profileRef.current && profileDropOpen,
    [profileDropOpen],
  );

  const showCID = React.useMemo(
    () => entryData.CID && akashaRef.current && displayCID,
    [displayCID, entryData.CID],
  );

  const showLinkPreview = React.useMemo(
    () => !props.isRemoved && entryData.linkPreview,
    [entryData.linkPreview, props.isRemoved],
  );

  const showQuote = React.useMemo(
    () =>
      !props.isRemoved &&
      entryData.quote &&
      !entryData.quote.isRemoved &&
      !entryData.quote.delisted &&
      !entryData.quote.reported,
    [entryData.quote, props.isRemoved],
  );

  const showRemovedQuote = React.useMemo(
    () => entryData.quote && entryData.quote.isRemoved,
    [entryData.quote],
  );

  const showReportedQuote = React.useMemo(
    () =>
      !props.isRemoved && entryData.quote && !entryData.quote.delisted && entryData.quote.reported,
    [entryData.quote, props.isRemoved],
  );

  const showDelistedQuote = React.useMemo(
    () => !props.isRemoved && entryData.quote && entryData.quote.delisted,
    [entryData.quote, props.isRemoved],
  );

  const [imageOverlayOpen, setImageOverlayOpen] = React.useState(false);
  const [currentImage, setCurrentImage] = React.useState<ImageObject | null>(null);

  /**
   * opens the fullscreen image modal and shows the clicked upon image in it
   */
  const handleClickImage = (image: ImageObject) => {
    setCurrentImage(image);
    setImageOverlayOpen(true);
  };

  const closeImageOverlay = () => {
    setImageOverlayOpen(false);
  };

  return (
    <ViewportSizeProvider>
      <Box background={error ? '#FFFDF1' : null} style={style}>
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
            style={{ display: 'flex', minWidth: 0 }}
            href={`${profileAnchorLink}/${entryData.author.pubKey}`}
            label={
              <StyledProfileAvatarButton
                label={entryData.author?.name}
                info={entryData.author?.name}
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
                // onMouseEnter={() => setProfileDropOpen(true)}
                // onMouseLeave={() => setProfileDropOpen(false)}
              />
            }
          />
          {showProfileDrop && (
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
                  loggedEthAddress={loggedProfileId}
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
              <Tooltip
                dropProps={{ align: { top: 'bottom' } }}
                message={formatDate(entryData.time, locale)}
                plain={true}
                caretPosition={'top'}
              >
                <Text style={{ flexShrink: 0 }} color="secondaryText">
                  {formatRelativeTime(entryData.time, locale)}
                </Text>
              </Tooltip>
            )}
            {!!entryData?.updatedAt && (
              <Tooltip
                dropProps={{ align: { top: 'bottom' } }}
                message={`${editedLabel} ${formatRelativeTime(entryData.updatedAt, locale)}`}
                plain={true}
                caretPosition={'top'}
              >
                <Icon size="sm" type="editSimple" clickable={false} />
              </Tooltip>
            )}
            <Icon
              type="akasha"
              size="sm"
              onClick={toggleDisplayCID}
              ref={akashaRef}
              clickable={false}
            />
            {showMore && entryData.type !== 'REMOVED' && (
              <Icon
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
        {showCID && (
          <CardHeaderAkashaDropdown
            target={akashaRef.current}
            onMenuClose={() => {
              setDisplayCID(false);
            }}
            CID={entryData.CID}
          />
        )}
        {showCardMenu && (
          <CardHeaderMenuDropdown
            target={menuIconRef.current}
            onMenuClose={closeMenuDrop}
            menuItems={[
              ...(onEntryFlag && !(entryData.author.ethAddress === loggedProfileId)
                ? [
                    {
                      icon: 'report' as IconType,
                      handler: handleEntryFlag,
                      label: flagAsLabel,
                      disabled: disableReporting,
                    },
                  ]
                : []),
              ...(entryData.author.ethAddress === loggedProfileId
                ? [
                    {
                      icon: 'trash' as IconType,
                      handler: handleEntryRemove,
                      label: removeEntryLabel,
                    },
                  ]
                : []),
            ]}
            headerMenuExt={props.headerMenuExt}
          />
        )}
        {showMobileCardMenu && (
          <MobileListModal
            modalSlotId={modalSlotId}
            closeModal={closeMenuDrop}
            menuItems={[
              ...(onEntryFlag && !(entryData.author.ethAddress === loggedProfileId)
                ? [
                    {
                      label: props.flagAsLabel,
                      icon: 'report',
                      handler: handleEntryFlag,
                      disabled: disableReporting,
                    },
                  ]
                : []),
              ...(entryData.author.ethAddress === loggedProfileId
                ? [
                    {
                      icon: 'trash' as IconType,
                      handler: handleEntryRemove,
                      label: removeEntryLabel,
                    },
                  ]
                : []),
            ]}
            headerMenuExt={props.headerMenuExt}
          />
        )}
        {props.isRemoved && (
          <EntryCardRemoved
            isAuthor={entryData.author.ethAddress === props.loggedProfileId}
            removedByAuthorLabel={removedByAuthorLabel}
            removedByMeLabel={removedByMeLabel}
          />
        )}
        {!props.isRemoved && !isEqual(entryData.slateContent, editorDefaultValue) && (
          <Box
            pad={{ horizontal: 'medium' }}
            height={{ max: '50rem' }}
            overflow={scrollHiddenContent ? 'auto' : 'hidden'}
            style={{ cursor: contentClickable ? 'pointer' : 'default' }}
            onClick={() => handleContentClick(entryData)}
          >
            <ReadOnlyEditor
              content={entryData.slateContent}
              handleMentionClick={onMentionClick}
              handleTagClick={onTagClick}
              handleLinkClick={handleLinkClick}
            />
          </Box>
        )}
        {showLinkPreview && (
          <Box pad="medium">
            <LinkPreview
              linkPreviewData={entryData.linkPreview}
              handleLinkClick={handleLinkClick}
            />
          </Box>
        )}
        {entryData.images && (
          <Box pad="medium">
            <EntryImageGallery images={entryData.images} handleClickImage={handleClickImage} />
          </Box>
        )}
        {imageOverlayOpen && (
          <MultipleImageOverlay
            clickedImg={currentImage}
            images={entryData.images}
            closeModal={closeImageOverlay}
          />
        )}
        {showQuote && (
          <Box pad="medium" onClick={() => handleContentClick(entryData.quote)}>
            <EmbedBox embedEntryData={entryData.quote} />
          </Box>
        )}
        {showRemovedQuote && (
          <EntryCardRemoved
            isAuthor={entryData.author.ethAddress === props.loggedProfileId}
            removedByAuthorLabel={removedByAuthorLabel}
            removedByMeLabel={removedByMeLabel}
          />
        )}
        {showReportedQuote && (
          <Box pad="medium" onClick={() => null}>
            <EntryCardHidden
              reason={entryData.reason}
              headerTextLabel={headerTextLabel}
              footerTextLabel={footerTextLabel}
              ctaLabel={ctaLabel}
              handleFlipCard={handleFlipCard}
            />
          </Box>
        )}
        {showDelistedQuote && (
          <Box pad="medium" onClick={() => null}>
            <EntryCardHidden moderatedContentLabel={moderatedContentLabel} isDelisted={true} />
          </Box>
        )}
        {!hideActionButtons && (
          <CardActions
            entryData={entryData}
            loggedProfileId={loggedProfileId}
            sharePostLabel={sharePostLabel}
            shareTextLabel={shareTextLabel}
            sharePostUrl={sharePostUrl}
            repliesLabel={repliesLabel}
            repostLabel={repostLabel}
            cancelLabel={cancelLabel}
            repostWithCommentLabel={repostWithCommentLabel}
            shareLabel={shareLabel}
            copyLinkLabel={copyLinkLabel}
            repliesAnchorLink={repliesAnchorLink}
            onRepost={handleRepost(false)}
            onRepostWithComment={handleRepost(true)}
            onShare={handleEntryShare}
            handleRepliesClick={handleRepliesClick}
            disableReposting={disableReposting}
            disableActions={disableActions}
            isModerated={isModerated}
            modalSlotId={modalSlotId}
            actionsRightExt={actionsRightExt}
            hideRepost={hideRepost}
          />
        )}
        {error && <EntryCardError error={error} onRetry={onRetry} />}
      </Box>
    </ViewportSizeProvider>
  );
};

export { EntryBox };
