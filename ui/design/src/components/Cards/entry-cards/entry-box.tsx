import { Box, Text } from 'grommet';
import * as React from 'react';
import { formatRelativeTime, ILocale } from '../../../utils/time';
import { ProfileAvatarButton } from '../../Buttons/index';
import { Icon } from '../../Icon/index';
import CardActions, { ServiceNames } from './card-actions';
import CardHeaderMenuDropdown from './card-header-menu';
import CardHeaderAkashaDropdown from './card-header-akasha';
import { StyledProfileDrop } from './styled-entry-box';
import { ProfileMiniCard } from '../profile-cards/profile-mini-card';
import { IProfileData } from '../profile-cards/profile-widget-card';
import { ISocialData } from './social-box';
import ViewportSizeProvider from '../../Providers/viewport-dimension';
import { EmbedBox, ReadOnlyEditor } from '../../Editor/index';

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
  socialData?: ISocialData;
  quote?: IEntryData;
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
  loggedProfileAvatar?: string;
  loggedProfileEthAddress?: string;
  // share data
  sharePostLabel?: string;
  shareTextLabel: string;
  sharePostUrl: string;
  // labels
  repliesLabel: string;
  repostsLabel: string;
  repostLabel: string;
  repostWithCommentLabel: string;
  shareLabel: string;
  flagAsLabel: string;
  copyLinkLabel: string;
  copyIPFSLinkLabel: string;
  comment?: boolean;
  bookmarkLabel: string;
  bookmarkedLabel: string;
  isBookmarked?: boolean;
  // handlers
  onEntryBookmark?: (entryId: string, isBookmarked?: boolean) => void;
  onClickAvatar: React.MouseEventHandler<HTMLDivElement>;
  onClickReplies: (entryId: string) => void;
  onEntryShare: (service: ServiceNames, entryId?: string, authorEthAddress?: string) => void;
  onRepost: (withComment: boolean, entryData: IEntryData) => void;
  onEntryFlag: (entryId?: string) => void;
  handleFollow: (profileEthAddress: string) => void;
  handleUnfollow: (profileEthAddress: string) => void;
  onContentClick?: (details: IContentClickDetails) => void;
  onMentionClick?: (ethAddress: string) => void;
  style?: React.CSSProperties;
}

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
    repostWithCommentLabel,
    shareLabel,
    flagAsLabel,
    copyLinkLabel,
    copyIPFSLinkLabel,
    locale,
    isBookmarked,
    bookmarkLabel,
    bookmarkedLabel,
    onEntryBookmark,
    onClickAvatar,
    onEntryShare,
    onRepost,
    onEntryFlag,
    handleFollow,
    handleUnfollow,
    onContentClick,
    onMentionClick,
    style,
  } = props;

  const [menuDropOpen, setMenuDropOpen] = React.useState(false);
  const [profileDropOpen, setProfileDropOpen] = React.useState(false);
  const [displayCID, setDisplayCID] = React.useState(false);

  const menuIconRef: React.Ref<HTMLDivElement> = React.useRef(null);
  const profileRef: React.Ref<HTMLDivElement> = React.useRef(null);
  const akashaRef: React.Ref<HTMLDivElement> = React.useRef(null);

  const handleLinkCopy = (linkType: 'ipfs' | 'shareable') => () => {
    switch (linkType) {
      case 'ipfs':
        return navigator.clipboard.writeText(entryData.ipfsLink);
      case 'shareable':
        return navigator.clipboard.writeText(window.location.href);
    }
  };

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
    onRepost(withComment, entryData);
  };

  const handleEntryShare = (service: ServiceNames) => {
    onEntryShare(service, entryData.entryId, entryData.author.ethAddress);
  };

  const handleEntryFlag = () => {
    onEntryFlag(entryData.entryId);
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
        <Box direction="row" justify="between" pad={{ vertical: 'medium' }}>
          <ProfileAvatarButton
            label={entryData.author?.userName}
            info={entryData.author?.ensName}
            avatarImage={entryData.author?.avatar}
            onClickAvatar={onClickAvatar}
            onClick={() => setProfileDropOpen(!profileDropOpen)}
            ethAddress={entryData.author?.ethAddress}
            ref={profileRef}
          />
          {profileRef.current && profileDropOpen && (
            <StyledProfileDrop
              overflow="hidden"
              target={profileRef.current}
              align={{ top: 'bottom', left: 'left' }}
              onClickOutside={() => setProfileDropOpen(false)}
              onEsc={() => setProfileDropOpen(false)}
            >
              <Box width="20rem" round="small" flex="grow">
                <ProfileMiniCard
                  profileData={entryData.author}
                  handleFollow={handleFollow}
                  handleUnfollow={handleUnfollow}
                />
              </Box>
            </StyledProfileDrop>
          )}
          <Box direction="row" gap="xsmall" align="center">
            {entryData.time && <Text>{formatRelativeTime(entryData.time, locale)}</Text>}
            <Icon
              type="akasha"
              size="sm"
              onClick={toggleDisplayCID}
              ref={akashaRef}
              clickable={true}
            />
            <Icon type="moreDark" onClick={toggleMenuDrop} clickable={true} ref={menuIconRef} />
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
        {menuIconRef.current && menuDropOpen && (
          <CardHeaderMenuDropdown
            target={menuIconRef.current}
            onMenuClose={closeMenuDrop}
            onLinkCopy={handleLinkCopy}
            onFlag={handleEntryFlag}
            flagAsLabel={flagAsLabel}
            copyIPFSLinkLabel={copyIPFSLinkLabel}
          />
        )}
        <Box pad={{ vertical: 'medium' }}>
          <ReadOnlyEditor content={entryData.content} handleMentionClick={onMentionClick} />
        </Box>
        {entryData.quote && (
          <Box pad={{ vertical: 'medium' }} onClick={() => handleContentClick(entryData.quote)}>
            <EmbedBox embedEntryData={entryData.quote} />
          </Box>
        )}
        <CardActions
          entryData={entryData}
          loggedProfileEthAddress={loggedProfileEthAddress}
          sharePostLabel={sharePostLabel}
          shareTextLabel={shareTextLabel}
          sharePostUrl={sharePostUrl}
          repliesLabel={repliesLabel}
          repostsLabel={repostsLabel}
          repostLabel={repostLabel}
          repostWithCommentLabel={repostWithCommentLabel}
          isBookmarked={isBookmarked}
          bookmarkLabel={bookmarkLabel}
          bookmarkedLabel={bookmarkedLabel}
          shareLabel={shareLabel}
          copyLinkLabel={copyLinkLabel}
          handleEntryBookmark={handleEntryBookmark}
          onRepost={handleRepost(false)}
          onRepostWithComment={handleRepost(true)}
          onShare={handleEntryShare}
          handleRepliesClick={handleRepliesClick}
          onLinkCopy={handleLinkCopy('shareable')}
        />
      </Box>
    </ViewportSizeProvider>
  );
};

export { EntryBox };
