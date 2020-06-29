import { Box, Text } from 'grommet';
import * as React from 'react';
import { formatDate, ILocale } from '../../../utils/time';
import { ProfileAvatarButton } from '../../Buttons/index';
import { Icon } from '../../Icon/index';
import { TextIcon } from '../../TextIcon/index';
import { StyledDrop, StyledSelectBox } from './styled-entry-card';

export interface IUser {
  userName?: string;
  ensName?: string;
  avatar?: string;
  ethAddress: string;
}

export interface IEntryData extends IUser {
  content: string;
  time: string;
  replies?: IEntryData[];
  reposts?: number;
  ipfsLink: string;
  permalink: string;
  entryId: string;
  bookmarked?: boolean;
}

export interface IEntryBoxProps {
  // data
  entryData: IEntryData;
  locale: ILocale;
  // handlers
  onClickAvatar: React.MouseEventHandler<HTMLAnchorElement>;
  onClickReplies: () => void;
  toggleBookmark: (entryId: string) => void;
  reportEntry: (entryId: string) => void;
  // labels

  repostLabel?: string;
  repostWithCommentLabel?: string;
  copyLinkLabel?: string;
  reportLabel?: string;
  shareOnLabel?: string;
}

const EntryBox: React.FC<IEntryBoxProps> = props => {
  const {
    entryData,
    locale,
    onClickAvatar,
    onClickReplies,
    toggleBookmark,
    reportEntry,
    repostLabel,
    repostWithCommentLabel,
    copyLinkLabel,
    reportLabel,
    shareOnLabel,
  } = props;

  const menuIconRef: React.Ref<any> = React.useRef(null);
  const repostIconRef: React.Ref<any> = React.useRef(null);
  const shareIconRef: React.Ref<any> = React.useRef(null);

  const [bookmarked, setBookmarked] = React.useState(false);
  const [menuDropOpen, setMenuDropOpen] = React.useState(false);
  const [repostDropOpen, setRepostDropOpen] = React.useState(false);
  const [shareDropOpen, setShareDropOpen] = React.useState(false);

  React.useEffect(() => {
    if (entryData.bookmarked) {
      setBookmarked(true);
    }
  }, []);

  const closeMenuDrop = () => {
    setMenuDropOpen(false);
  };

  const closeRepostDrop = () => {
    setRepostDropOpen(false);
  };

  const closeShareDrop = () => {
    setShareDropOpen(false);
  };

  const toggleMenuDrop = () => {
    setMenuDropOpen(!menuDropOpen);
  };

  const handleCopyIpfsLink = () => {
    navigator.clipboard.writeText(entryData.ipfsLink);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(entryData.permalink);
  };

  const handleReport = () => {
    reportEntry(entryData.entryId);
  };

  const handleToggleBookmark = () => {
    setBookmarked(!bookmarked);
    toggleBookmark(entryData.entryId);
  };

  const handleRepliesClick = () => {
    onClickReplies();
  };

  const handleRepost = () => {
    return;
  };

  const handleRepostWithComment = () => {
    return;
  };

  const handleShareTwitter = () => {
    return;
  };
  const handleShareReddit = () => {
    return;
  };
  const handleShareFacebook = () => {
    return;
  };
  // @TODO extract as separate component
  const renderMenuDrop = () => {
    return (
      <StyledDrop
        overflow="hidden"
        target={menuIconRef.current}
        align={{ top: 'bottom', right: 'right' }}
        onClickOutside={closeMenuDrop}
        onEsc={closeMenuDrop}
      >
        <Box pad="small" gap="small" margin={{ right: 'small' }}>
          <StyledSelectBox>
            <TextIcon
              iconType="appIpfs"
              label={copyLinkLabel}
              onClick={handleCopyIpfsLink}
              clickable={true}
              iconSize="xs"
            />
          </StyledSelectBox>
          <StyledSelectBox>
            <TextIcon
              iconType="report"
              label={reportLabel}
              onClick={handleReport}
              clickable={true}
              color={'red'}
              iconSize="xs"
            />
          </StyledSelectBox>
        </Box>
      </StyledDrop>
    );
  };
  const renderRepostDrop = () => {
    return (
      <StyledDrop
        overflow="hidden"
        target={repostIconRef.current}
        align={{ top: 'bottom', left: 'left' }}
        onClickOutside={closeRepostDrop}
        onEsc={closeRepostDrop}
      >
        <Box pad="small" gap="small" margin={{ right: 'small' }}>
          <StyledSelectBox>
            <TextIcon
              iconType="transfer"
              label={repostLabel}
              onClick={handleRepost}
              clickable={true}
              iconSize="xs"
            />
          </StyledSelectBox>
          <StyledSelectBox>
            <TextIcon
              iconType="edit"
              label={repostWithCommentLabel}
              onClick={handleRepostWithComment}
              clickable={true}
              iconSize="xs"
            />
          </StyledSelectBox>
        </Box>
      </StyledDrop>
    );
  };
  const renderShareDrop = () => {
    return (
      <StyledDrop
        overflow="hidden"
        target={shareIconRef.current}
        align={{ top: 'bottom', right: 'right' }}
        onClickOutside={closeShareDrop}
        onEsc={closeShareDrop}
      >
        <Box pad="small" gap="small" margin={{ right: 'small' }}>
          <StyledSelectBox>
            <TextIcon
              iconType="link"
              label={copyLinkLabel}
              onClick={handleCopyLink}
              clickable={true}
              primaryColor={true}
              iconSize="xs"
            />
          </StyledSelectBox>
          <StyledSelectBox>
            <TextIcon
              iconType="twitter"
              label={`${shareOnLabel} Twitter`}
              onClick={handleShareTwitter}
              clickable={true}
              primaryColor={true}
              iconSize="xs"
            />
          </StyledSelectBox>
          <StyledSelectBox>
            <TextIcon
              iconType="reddit"
              label={`${shareOnLabel} Reddit`}
              onClick={handleShareReddit}
              clickable={true}
              primaryColor={true}
              iconSize="xs"
            />
          </StyledSelectBox>
          <StyledSelectBox>
            <TextIcon
              iconType="facebook"
              label={`${shareOnLabel} Facebook`}
              onClick={handleShareFacebook}
              clickable={true}
              primaryColor={true}
              iconSize="xs"
            />
          </StyledSelectBox>
        </Box>
      </StyledDrop>
    );
  };

  return (
    <>
      <Box direction="row" justify="between" pad={{ vertical: 'medium' }}>
        <ProfileAvatarButton
          label={entryData.userName}
          info={entryData.ensName}
          avatarImage={entryData.avatar}
          onClick={onClickAvatar}
          ethAddress={entryData.ethAddress}
        />
        <Box direction="row" gap="xsmall" align="center">
          <Text>{formatDate(entryData.time, locale)}</Text>
          <Icon
            type="bookmark"
            onClick={handleToggleBookmark}
            clickable={true}
            accentColor={bookmarked}
          />
          <Icon type="moreDark" onClick={toggleMenuDrop} clickable={true} ref={menuIconRef} />
        </Box>
      </Box>
      {menuIconRef.current && menuDropOpen && renderMenuDrop()}

      <Box pad={{ vertical: 'medium' }}>{entryData.content}</Box>

      <Box pad={{ vertical: 'medium' }} direction="row" justify="between">
        <Box gap="medium" direction="row">
          <Box direction="row" gap="xxsmall" align="center">
            <Icon
              type="transfer"
              size="md"
              clickable={true}
              ref={repostIconRef}
              onClick={() => setRepostDropOpen(!repostDropOpen)}
            />
            <Text>{entryData.reposts || 0}</Text>
          </Box>
          <Box direction="row" gap="xxsmall" align="center">
            <Icon type="comments" clickable={true} onClick={handleRepliesClick} size="md" />
            <Text>{entryData.replies?.length || 0}</Text>
          </Box>
        </Box>
        <Icon
          type="shareSmallDark"
          size="md"
          ref={shareIconRef}
          clickable={true}
          onClick={() => setShareDropOpen(!shareDropOpen)}
        />
      </Box>
      {repostIconRef.current && repostDropOpen && renderRepostDrop()}
      {shareIconRef.current && shareDropOpen && renderShareDrop()}
    </>
  );
};

EntryBox.defaultProps = {
  repostLabel: 'Repost',
  repostWithCommentLabel: 'Repost With Comment',
  copyLinkLabel: 'Copy Link',
  reportLabel: 'Report',
  shareOnLabel: 'Share On',
};

export { EntryBox };
