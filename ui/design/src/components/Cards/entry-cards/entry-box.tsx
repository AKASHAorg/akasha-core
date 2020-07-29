import { Box, Text } from 'grommet';
import * as React from 'react';
import { formatDate, ILocale } from '../../../utils/time';
import { ProfileAvatarButton } from '../../Buttons/index';
import { Icon } from '../../Icon/index';
import CardActions, { ServiceNames } from './card-actions';
import CardHeaderMenuDropdown from './card-header-menu';
import { StyledProfileDrop } from './styled-entry-box';
import { ProfileMiniCard } from '../profile-cards/profile-mini-card';
import { IProfileData } from '../profile-cards/profile-widget-card';
import { ISocialData } from './social-box';
import { useViewportSize } from '../../Providers/viewport-dimension';

export interface IEntryData {
  content: string;
  time: string;
  replies?: IEntryData[];
  reposts?: number;
  ipfsLink: string;
  permalink: string;
  entryId: string;
  author: IProfileData;
  socialData?: ISocialData;
}

export interface IEntryBoxProps {
  // data
  entryData: IEntryData;
  locale: ILocale;
  loggedProfileAvatar?: string;
  loggedProfileEthAddress?: string;
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
  isBookmarked: boolean | null;
  // handlers
  onEntryBookmark?: (entryId: string, isBookmarked: boolean | null) => void;
  onClickAvatar: React.MouseEventHandler<HTMLDivElement>;
  onClickReplies: (entryId: string) => void;
  onEntryShare: (service: ServiceNames, entryId?: string) => void;
  onLinkCopy: (link: string) => void;
  onRepost: (withComment: boolean, entryId?: string) => void;
  onEntryFlag: (entryId?: string) => void;
  handleFollow: (profileEthAddress: string) => void;
  handleUnfollow: (profileEthAddress: string) => void;
}

const EntryBox: React.FC<IEntryBoxProps> = props => {
  const {
    entryData,
    loggedProfileEthAddress,
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
    onClickReplies,
    onEntryShare,
    onLinkCopy,
    onRepost,
    onEntryFlag,
    handleFollow,
    handleUnfollow,
  } = props;

  const size = useViewportSize().size;

  const [menuDropOpen, setMenuDropOpen] = React.useState(false);
  const [profileDropOpen, setProfileDropOpen] = React.useState(false);

  const menuIconRef: React.Ref<any> = React.useRef(null);
  const profileRef: React.Ref<any> = React.useRef(null);

  const handleLinkCopy = (linkType: 'ipfs' | 'shareable') => () => {
    switch (linkType) {
      case 'ipfs':
        return onLinkCopy('dummiIPFScid');
      case 'shareable':
        return onLinkCopy('http://dummy.link');
    }
  };

  const closeMenuDrop = () => {
    setMenuDropOpen(false);
  };

  const toggleMenuDrop = () => {
    setMenuDropOpen(!menuDropOpen);
  };

  const handleEntryBookmark = () => {
    if (onEntryBookmark && entryData.entryId) {
      onEntryBookmark(entryData.entryId, isBookmarked);
    }
  };

  const handleRepost = (withComment: boolean) => () => {
    onRepost(withComment, entryData.entryId);
  };

  const handleEntryShare = (service: ServiceNames) => {
    onEntryShare(service, entryData.entryId);
  };

  const handleEntryFlag = () => {
    onEntryFlag(entryData.entryId);
  };

  const handleRepliesClick = () => {
    onClickReplies(entryData.entryId);
  };

  return (
    <>
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
            <Box width="20rem" round="small">
              <ProfileMiniCard
                profileData={entryData.author}
                handleFollow={handleFollow}
                handleUnfollow={handleUnfollow}
              />
            </Box>
          </StyledProfileDrop>
        )}
        <Box direction="row" gap="xsmall" align="center">
          <Text>{formatDate(entryData.time, locale)}</Text>

          <Icon type="moreDark" onClick={toggleMenuDrop} clickable={true} ref={menuIconRef} />
        </Box>
      </Box>
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
      <Box pad={{ vertical: 'medium' }}>{entryData.content}</Box>
      <CardActions
        entryData={entryData}
        loggedProfileEthAddress={loggedProfileEthAddress}
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
        size={size}
      />
    </>
  );
};

export { EntryBox };
