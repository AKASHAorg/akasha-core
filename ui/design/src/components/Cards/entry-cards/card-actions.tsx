import * as React from 'react';
import { Box } from 'grommet';
import { StyledDrop, StyledSelectBox } from './styled-entry-box';
import { TextIcon } from '../../TextIcon';
import { IEntryData } from './entry-box';
import { MobileListModal } from '../../Modals';

export type ServiceNames = 'twitter' | 'reddit' | 'facebook';

export interface CardActionProps {
  // data
  entryData: IEntryData;
  loggedProfileEthAddress?: string;
  // labels
  repostsLabel: string;
  repostLabel: string;
  repostWithCommentLabel: string;
  repliesLabel: string;
  isBookmarked: boolean | null;
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
  onLinkCopy: () => void;
  // screen size passed by viewport provider
  size?: string;
}

const CardActions: React.FC<CardActionProps> = props => {
  const {
    // data
    entryData,
    loggedProfileEthAddress,
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
    onLinkCopy,
    // screen size
    size,
  } = props;

  const [repostDropOpen, setReplyDropOpen] = React.useState(false);
  const [shareDropOpen, setShareDropOpen] = React.useState(false);

  const repostNodeRef: React.RefObject<any> = React.useRef(null);
  const shareNodeRef: React.RefObject<any> = React.useRef(null);

  const handleRepostsOpen = () => {
    setReplyDropOpen(!repostDropOpen);
  };
  const handleRepostsClose = () => {
    setReplyDropOpen(false);
  };

  const handleShareOpen = () => {
    setShareDropOpen(!shareDropOpen);
  };

  const handleShareClose = () => {
    setShareDropOpen(false);
  };
  const handleShare = (service: ServiceNames) => () => {
    onShare(service);
  };

  const renderRepostDrop = () => {
    const menuItems = [
      {
        label: repostLabel,
        icon: 'transfer',
        handler: (e: any) => {
          // block event bubbling to parent
          e.stopPropagation();
          return;
        },
      },
      {
        label: repostWithCommentLabel,
        icon: 'edit',
        handler: (e: any) => {
          e.stopPropagation();
          return;
        },
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
              onClick={onRepost}
              clickable={true}
              iconSize="xs"
              fontSize="small"
            />
          </StyledSelectBox>
          <StyledSelectBox>
            <TextIcon
              iconType="edit"
              label={repostWithCommentLabel}
              onClick={onRepostWithComment}
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
              onClick={onLinkCopy}
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
    size === 'small'
      ? `${entryData.replies?.length || 0}`
      : `${entryData.replies?.length || 0} ${repliesLabel}`;
  const bookmarkBtnText =
    size === 'small' ? undefined : isBookmarked ? bookmarkedLabel : bookmarkLabel;
  const shareBtnText = size === 'small' ? undefined : shareLabel;

  return (
    <Box pad={{ vertical: 'medium' }} direction="row" justify="between">
      {repostNodeRef.current && repostDropOpen && renderRepostDrop()}
      <TextIcon
        label={repostsBtnText}
        iconType="transfer"
        iconSize="md"
        clickable={true}
        ref={repostNodeRef}
        onClick={handleRepostsOpen}
      />
      <TextIcon
        label={repliesBtnText}
        iconType="comments"
        iconSize="md"
        clickable={true}
        onClick={handleRepliesClick}
      />

      {isBookmarked !== null && (
        <TextIcon
          label={bookmarkBtnText}
          iconType="bookmark"
          iconSize="md"
          clickable={!!loggedProfileEthAddress}
          onClick={handleEntryBookmark}
        />
      )}
      {shareNodeRef.current && shareDropOpen && renderShareDrop()}
      <TextIcon
        label={shareBtnText}
        iconType="shareSmallDark"
        iconSize="md"
        ref={shareNodeRef}
        clickable={true}
        onClick={handleShareOpen}
      />
    </Box>
  );
};

export default CardActions;
