import { Box, Text } from 'grommet';
import * as React from 'react';
import { formatDate, ILocale } from '../../../utils/time';
import { ProfileAvatarButton } from '../../Buttons/index';
import { Icon } from '../../Icon/index';
import { TextIcon } from '../../TextIcon/index';
import { StyledDrop, StyledSelectBox } from './styled-entry-card';
import { MainAreaCardBox } from '../common/basic-card-box';
import { StackedAvatar } from '../../Avatar/index';

export interface IUser {
  userName?: string;
  ensName?: string;
  avatar?: string;
  ethAddress: string;
}

export interface ISocialData {
  users: IUser[];
}

export interface IEntryData extends IUser {
  content: string;
  time: string;
  comments?: Comment[];
  reposts: Repost[];
  ipfsLink: string;
}

export interface Comment extends IUser {
  content: string;
  time: string;
  reposts: Repost[];
}

export interface Repost extends IUser {
  time: string;
}
export interface IEntryCardProps {
  // data
  entryData: IEntryData;
  socialData?: ISocialData;
  repostsNumber?: number;
  commentsNumber?: number;
  locale: ILocale;
  permalink: string;
  // handlers
  onClickAvatar: React.MouseEventHandler<HTMLAnchorElement>;
  onClickComments: () => void;
  toggleBookmark?: (entryId: string) => void;
  reportEntry?: (entryId: string) => void;
  // labels
  repostedThisLabel?: string;
  andLabel?: string;
  othersLabel?: string;
  repostLabel?: string;
  repostWithCommentLabel?: string;
  copyLinkLabel?: string;
  reportLabel?: string;
  shareOnLabel?: string;
  // external css
  className?: string;
  style?: React.CSSProperties;
  rootNodeRef?: React.Ref<HTMLDivElement>;
}

const EntryBox: React.FC<IEntryCardProps> = props => {
  const {
    entryData,
    socialData,
    repostsNumber,
    commentsNumber,
    locale,
    permalink,
    onClickAvatar,
    onClickComments,
    repostedThisLabel,
    andLabel,
    othersLabel,
    repostLabel,
    repostWithCommentLabel,
    copyLinkLabel,
    reportLabel,
    shareOnLabel,
    className,
    style,
    rootNodeRef,
  } = props;

  const menuIconRef: React.Ref<any> = React.useRef(null);
  const repostIconRef: React.Ref<any> = React.useRef(null);
  const shareIconRef: React.Ref<any> = React.useRef(null);

  const [menuDropOpen, setMenuDropOpen] = React.useState(false);
  const [repostDropOpen, setRepostDropOpen] = React.useState(false);
  const [shareDropOpen, setShareDropOpen] = React.useState(false);

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
    navigator.clipboard.writeText(permalink);
  };

  const handleReport = () => {
    return;
  };

  const handleToggleBookmark = () => {
    return;
  };

  const handleCommentsClick = () => {
    onClickComments();
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

  const renderMenuDrop = () => {
    return (
      <StyledDrop
        overflow="hidden"
        target={menuIconRef.current}
        align={{ top: 'bottom', right: 'left' }}
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
            />
          </StyledSelectBox>
          <StyledSelectBox>
            <TextIcon
              iconType="report"
              label={reportLabel}
              onClick={handleReport}
              clickable={true}
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
        target={menuIconRef.current}
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
            />
          </StyledSelectBox>
          <StyledSelectBox>
            <TextIcon
              iconType="edit"
              label={repostWithCommentLabel}
              onClick={handleRepostWithComment}
              clickable={true}
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
        target={menuIconRef.current}
        align={{ top: 'bottom', left: 'right' }}
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
            />
          </StyledSelectBox>
          <StyledSelectBox>
            <TextIcon
              iconType="twitter"
              label={`${shareOnLabel} Twitter`}
              onClick={handleShareTwitter}
              clickable={true}
            />
          </StyledSelectBox>
          <StyledSelectBox>
            <TextIcon
              iconType="reddit"
              label={`${shareOnLabel} Reddit`}
              onClick={handleShareReddit}
              clickable={true}
            />
          </StyledSelectBox>
          <StyledSelectBox>
            <TextIcon
              iconType="facebook"
              label={`${shareOnLabel} Facebook`}
              onClick={handleShareFacebook}
              clickable={true}
            />
          </StyledSelectBox>
        </Box>
      </StyledDrop>
    );
  };

  const renderSocialBar = () => {
    const avatarUserData = socialData?.users.map(user => {
      return { ethAddress: user.ethAddress, avatar: user.avatar };
    });
    return (
      <Box direction="row" gap="xxsmall">
        {avatarUserData && <StackedAvatar userData={avatarUserData} />}
        <Text>
          {socialData?.users[0].userName
            ? socialData?.users[0].userName
            : socialData?.users[0].ethAddress}
        </Text>
        {socialData && socialData.users.length > 1 ? (
          <Box direction="row" gap="xxsmall">
            <Text color="secondaryText">{andLabel}</Text>
            <Text>{`${socialData.users.length} ${othersLabel}`}</Text>
            <Text color="secondaryText">{repostedThisLabel}</Text>
          </Box>
        ) : (
          <Text color="secondaryText">{repostedThisLabel}</Text>
        )}
      </Box>
    );
  };

  return (
    <MainAreaCardBox className={className} style={style} rootNodeRef={rootNodeRef}>
      {socialData && socialData.users.length > 0 && renderSocialBar()}
      <Box direction="row" justify="between" margin="medium">
        <ProfileAvatarButton
          label={entryData.userName}
          info={entryData.ensName}
          avatarImage={entryData.avatar}
          onClick={onClickAvatar}
          ethAddress={entryData.ethAddress}
        />
        <Box direction="row" gap="xsmall">
          <Text>{formatDate(entryData.time, locale)}</Text>
          <Icon type="bookmark" onClick={handleToggleBookmark} clickable={true} />
          <Icon type="moreDark" onClick={toggleMenuDrop} clickable={true} ref={menuIconRef} />
        </Box>
      </Box>
      {menuIconRef.current && menuDropOpen && renderMenuDrop()}

      <Box pad="medium">{entryData.content}</Box>

      <Box pad="medium" direction="row" justify="between">
        <Box gap="medium" direction="row">
          <Box direction="row" gap="xxsmall">
            <Icon
              type="transfer"
              clickable={true}
              ref={repostIconRef}
              onClick={() => setRepostDropOpen(true)}
            />
            <Text>{repostsNumber}</Text>
          </Box>
          <Box direction="row" gap="xxsmall">
            <Icon type="comment" clickable={true} onClick={handleCommentsClick} />
            <Text>{commentsNumber}</Text>
          </Box>
        </Box>
        <Icon
          type="share"
          ref={shareIconRef}
          clickable={true}
          onClick={() => setShareDropOpen(true)}
        />
      </Box>
      {repostIconRef.current && repostDropOpen && renderRepostDrop()}
      {shareIconRef.current && shareDropOpen && renderShareDrop()}
    </MainAreaCardBox>
  );
};

EntryBox.defaultProps = {
  repostedThisLabel: 'reposted this',
  andLabel: 'and',
  othersLabel: 'others',
  repostLabel: 'Repost',
  repostWithCommentLabel: 'Repost With Comment',
  copyLinkLabel: 'Copy Link',
  reportLabel: 'Report',
  shareOnLabel: 'Share On',
};

export default EntryBox;
