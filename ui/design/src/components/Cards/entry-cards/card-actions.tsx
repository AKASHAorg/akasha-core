import * as React from 'react';
import { Anchor, Box } from 'grommet';
import { isMobile } from 'react-device-detect';

import { StyledDrop, StyledSelectBox } from './styled-entry-box';
import { TextIcon } from '../../TextIcon';
import { IEntryData } from './entry-box';
import { MobileListModal } from '../../Modals';
import styled from 'styled-components';

export type ServiceNames = 'twitter' | 'reddit' | 'facebook' | 'copy';

export type ShareData = {
  title?: string;
  text?: string;
  url?: string;
};

export interface CardActionProps {
  // data
  entryData: IEntryData;
  loggedProfileEthAddress?: string | null;
  // share data
  sharePostLabel?: string;
  shareTextLabel?: string;
  sharePostUrl?: string;
  // labels
  repostsLabel: string;
  repostLabel?: string;
  cancelLabel?: string;
  repostWithCommentLabel?: string;
  repliesLabel: string;
  isBookmarked?: boolean;
  copyLinkLabel?: string;
  bookmarkLabel?: string;
  bookmarkedLabel?: string;
  shareLabel?: string;
  // anchor link
  repliesAnchorLink?: string;
  // handlers
  handleEntryBookmark?: () => void;
  onRepost: () => void;
  handleRepliesClick: () => void;
  onShare: (service: ServiceNames, entryId: string) => void;
  disableActions?: boolean;
  onRepostWithComment?: () => void;
  disableReposting?: boolean;
  isModerated?: boolean;
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
    cancelLabel,
    repostWithCommentLabel,
    repliesLabel,
    isBookmarked,
    bookmarkLabel,
    bookmarkedLabel,
    shareLabel,
    copyLinkLabel,
    repliesAnchorLink,
    // handlers
    handleEntryBookmark,
    onRepost,
    handleRepliesClick,
    onRepostWithComment,
    onShare,
    disableReposting,
    disableActions,
    isModerated,
  } = props;

  const [repostDropOpen, setRepostDropOpen] = React.useState(false);
  const [shareDropOpen, setShareDropOpen] = React.useState(false);

  const repostNodeRef: React.RefObject<any> = React.useRef(null);
  const shareNodeRef: React.RefObject<any> = React.useRef(null);

  const shareData: ShareData = {
    // @TODO: replace with appropriate title, text and url of the post to be shared
    title: sharePostLabel,
    text: shareTextLabel,
    url: `${sharePostUrl}${entryData.entryId}`,
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
      isMobile &&
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
    onShare(service, entryData.entryId);
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
    if (onRepostWithComment) {
      onRepostWithComment();
    }
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

    if (isMobile) {
      return (
        <MobileListModal
          menuItems={menuItems}
          cancelLabel={cancelLabel}
          closeModal={handleRepostsClose}
        />
      );
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

  const repostsBtnText = isMobile
    ? `${entryData.reposts || 0}`
    : `${entryData.reposts || 0} ${repostsLabel}`;
  const repliesBtnText = isMobile
    ? `${entryData.replies || 0}`
    : `${entryData.replies || 0} ${repliesLabel}`;
  const bookmarkBtnText = isMobile ? undefined : isBookmarked ? bookmarkedLabel : bookmarkLabel;
  const shareBtnText = isMobile ? undefined : shareLabel;

  if (isModerated) {
    return (
      <Box
        width="75%"
        alignSelf="center"
        pad={{ vertical: 'medium' }}
        direction="row"
        justify="between"
      >
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
          clickable={disableReposting ? false : true}
          onClick={disableReposting ? () => false : handleRepliesClick}
          disabled={disableReposting}
        />
      </Box>
    );
  }

  return (
    <Box pad="medium" direction="row" justify="between">
      {repostNodeRef.current && repostDropOpen && renderRepostDrop()}
      <TextIcon
        label={repostsBtnText}
        iconType="transfer"
        iconSize="sm"
        fontSize="large"
        clickable={!disableReposting && !disableActions}
        ref={repostNodeRef}
        onClick={() => {
          if (disableActions || disableReposting) {
            return;
          }
          onRepost();
        }}
        disabled={disableReposting || disableActions}
      />
      <Anchor
        onClick={e => {
          e.preventDefault();
          return false;
        }}
        weight="normal"
        href={`${repliesAnchorLink}/${entryData.entryId}`}
        style={{ textDecoration: 'none' }}
        label={
          <TextIcon
            label={repliesBtnText}
            iconType="comments"
            iconSize="sm"
            fontSize="large"
            clickable={!disableActions}
            onClick={() => {
              if (disableActions) {
                return;
              }
              handleRepliesClick();
            }}
            disabled={disableActions}
          />
        }
      />
      <BookmarkButton
        label={bookmarkBtnText}
        iconType="bookmark"
        iconSize="sm"
        fontSize="large"
        clickable={!disableActions}
        onClick={() => {
          if (disableActions) {
            return;
          }
          if (handleEntryBookmark) {
            handleEntryBookmark();
          }
        }}
        isBookmarked={isBookmarked}
        disabled={disableActions}
      />
      {shareNodeRef.current && shareDropOpen && renderShareDrop()}
      {/* disable sharing for v0.1 */}
      {false && (
        <TextIcon
          label={shareBtnText}
          iconType="shareSmallDark"
          iconSize="sm"
          fontSize="large"
          ref={shareNodeRef}
          clickable={!disableActions}
          onClick={() => {
            if (disableActions) {
              return;
            }
            handleShareOpen();
          }}
          disabled={disableActions}
        />
      )}
    </Box>
  );
};

export default CardActions;
