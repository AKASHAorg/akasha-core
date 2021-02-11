import * as React from 'react';
import { Box } from 'grommet';
import { useViewportSize } from '../../Providers/viewport-dimension';
import { StyledDrop, StyledSelectBox } from './styled-entry-box';
import { TextIcon } from '../../TextIcon';
import { IEntryData } from './entry-box';
import { MobileListModal } from '../../Modals';
import styled from 'styled-components';

export type ServiceNames = 'twitter' | 'reddit' | 'facebook' | 'copy';

export type ShareData = {
  title?: string;
  text: string;
  url: string;
};

export interface CardActionProps {
  // data
  entryData: IEntryData;
  loggedProfileEthAddress: string | null;
  // share data
  sharePostLabel?: string;
  shareTextLabel: string;
  sharePostUrl: string;
  // labels
  repostsLabel: string;
  repostLabel: string;
  repostWithCommentLabel: string;
  repliesLabel: string;
  isBookmarked?: boolean;
  copyLinkLabel: string;
  bookmarkLabel: string;
  bookmarkedLabel: string;
  shareLabel: string;
  // handlers
  handleEntryBookmark: () => void;
  onRepost: () => void;
  handleRepliesClick: () => void;
  onRepostWithComment: () => void;
  onShare: (service: ServiceNames) => void;
  disableReposting?: boolean;
}

const BookmarkButton = styled(TextIcon)<{ isBookmarked?: boolean }>`
  svg * {
    ${props => {
      if (props.isBookmarked) {
        return `
          fill: ${props.theme.colors.blue};
          stroke: ${props.theme.colors.blue};
        `;
      }
      return '';
    }}
  }
`;

const CardActions: React.FC<CardActionProps> = props => {
  const {
    // data
    entryData,
    // share data
    sharePostLabel,
    shareTextLabel,
    sharePostUrl,
    // labels
    repostsLabel,
    repostLabel,
    repostWithCommentLabel,
    repliesLabel,
    isBookmarked,
    bookmarkLabel,
    bookmarkedLabel,
    shareLabel,
    copyLinkLabel,
    // handlers
    handleEntryBookmark,
    onRepost,
    handleRepliesClick,
    onRepostWithComment,
    onShare,
    disableReposting,
  } = props;

  const { size } = useViewportSize();

  const [repostDropOpen, setRepostDropOpen] = React.useState(false);
  const [shareDropOpen, setShareDropOpen] = React.useState(false);

  const repostNodeRef: React.RefObject<any> = React.useRef(null);
  const shareNodeRef: React.RefObject<any> = React.useRef(null);

  const shareData: ShareData = {
    // @TODO: replace with appropriate title, text and url of the post to be shared
    title: sharePostLabel,
    text: shareTextLabel,
    url: sharePostUrl,
  };

  // const handleRepostsOpen = () => {
  //   setRepostDropOpen(!repostDropOpen);
  // };
  const handleRepostsClose = () => {
    setRepostDropOpen(false);
  };

  const handleShareOpen = () => {
    const winNavigator: Navigator & {
      canShare?: (param: ShareData) => void;
      share?: (data: ShareData) => Promise<void>;
    } = window.navigator;

    if (
      size === 'small' &&
      winNavigator.share &&
      winNavigator.canShare &&
      winNavigator.canShare(shareData)
    ) {
      winNavigator.share(shareData);
      return;
    }
    setShareDropOpen(!shareDropOpen);
  };

  const handleShareClose = () => {
    setShareDropOpen(false);
  };
  const handleShare = (service: ServiceNames) => () => {
    onShare(service);
    setShareDropOpen(false);
  };

  const handleRepost = (ev: React.SyntheticEvent) => {
    ev.stopPropagation();
    handleRepostsClose();
    onRepost();
  };

  const handleRepostWithComment = (ev: React.SyntheticEvent) => {
    ev.stopPropagation();
    handleRepostsClose();
    onRepostWithComment();
  };

  const renderRepostDrop = () => {
    const menuItems = [
      {
        label: repostLabel,
        icon: 'transfer',
        handler: handleRepost,
      },
      {
        label: repostWithCommentLabel,
        icon: 'edit',
        handler: handleRepostWithComment,
      },
    ];

    if (size === 'small') {
      return <MobileListModal menuItems={menuItems} closeModal={handleRepostsClose} />;
    }

    return (
      <StyledDrop
        target={repostNodeRef.current}
        align={{ top: 'bottom', left: 'left' }}
        onClickOutside={handleRepostsClose}
        onEsc={handleRepostsClose}
        overflow="hidden"
      >
        <Box pad="xxsmall" width={{ min: '13rem' }}>
          <StyledSelectBox>
            <TextIcon
              iconType="transfer"
              label={repostLabel}
              onClick={handleRepost}
              clickable={true}
              iconSize="xs"
              fontSize="small"
            />
          </StyledSelectBox>
          <StyledSelectBox>
            <TextIcon
              iconType="edit"
              label={repostWithCommentLabel}
              onClick={handleRepostWithComment}
              clickable={true}
              iconSize="xs"
              fontSize="small"
            />
          </StyledSelectBox>
        </Box>
      </StyledDrop>
    );
  };
  const renderShareDrop = () => {
    return (
      <StyledDrop
        target={shareNodeRef.current}
        align={{ top: 'bottom', right: 'right' }}
        onClickOutside={handleShareClose}
        onEsc={handleShareClose}
        overflow="hidden"
        style={{
          minWidth: '11em',
        }}
      >
        <Box pad="xxsmall">
          <StyledSelectBox>
            <TextIcon
              iconType="link"
              label={copyLinkLabel}
              onClick={handleShare('copy')}
              clickable={true}
              primaryColor={true}
              iconSize="xs"
              fontSize="small"
            />
          </StyledSelectBox>
          <StyledSelectBox>
            <TextIcon
              iconType="twitter"
              label={`${shareLabel} Twitter`}
              onClick={handleShare('twitter')}
              clickable={true}
              primaryColor={true}
              iconSize="xs"
              fontSize="small"
            />
          </StyledSelectBox>
          <StyledSelectBox>
            <TextIcon
              iconType="reddit"
              label={`${shareLabel} Reddit`}
              onClick={handleShare('reddit')}
              clickable={true}
              primaryColor={true}
              iconSize="xs"
              fontSize="small"
            />
          </StyledSelectBox>
          <StyledSelectBox>
            <TextIcon
              iconType="facebook"
              label={`${shareLabel} Facebook`}
              onClick={handleShare('facebook')}
              clickable={true}
              primaryColor={true}
              iconSize="xs"
              fontSize="small"
            />
          </StyledSelectBox>
        </Box>
      </StyledDrop>
    );
  };

  const repostsBtnText =
    size === 'small' ? `${entryData.reposts || 0}` : `${entryData.reposts || 0} ${repostsLabel}`;
  const repliesBtnText =
    size === 'small' ? `${entryData.replies || 0}` : `${entryData.replies || 0} ${repliesLabel}`;
  const bookmarkBtnText =
    size === 'small' ? undefined : isBookmarked ? bookmarkedLabel : bookmarkLabel;
  const shareBtnText = size === 'small' ? undefined : shareLabel;

  return (
    <Box pad={{ vertical: 'medium' }} direction="row" justify="between">
      {repostNodeRef.current && repostDropOpen && renderRepostDrop()}
      <TextIcon
        label={repostsBtnText}
        iconType="transfer"
        iconSize="sm"
        fontSize="large"
        clickable={disableReposting ? false : true}
        ref={repostNodeRef}
        onClick={disableReposting ? () => false : onRepost}
        disabled={disableReposting}
      />
      <TextIcon
        label={repliesBtnText}
        iconType="comments"
        iconSize="sm"
        fontSize="large"
        clickable={true}
        onClick={handleRepliesClick}
      />
      <BookmarkButton
        label={bookmarkBtnText}
        iconType="bookmark"
        iconSize="sm"
        fontSize="large"
        clickable={true}
        onClick={handleEntryBookmark}
        isBookmarked={isBookmarked}
      />
      {shareNodeRef.current && shareDropOpen && renderShareDrop()}
      <TextIcon
        label={shareBtnText}
        iconType="shareSmallDark"
        iconSize="sm"
        fontSize="large"
        ref={shareNodeRef}
        clickable={true}
        onClick={handleShareOpen}
      />
    </Box>
  );
};

export default CardActions;
