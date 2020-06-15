import * as React from 'react';
import { Box } from 'grommet';
import { PlainButton } from '../../Buttons';
import { Icon } from '../../Icon';
import { StyledDrop, StyledSelectBox } from './styled-entry-box';
import { TextIcon } from '../../TextIcon';
export type ServiceNames = 'twitter' | 'reddit' | 'facebook';

export interface CardActionProps {
  repostsLabel: string;
  repliesLabel: string;
  isBookmarked: boolean | null;
  bookmarkLabel: string;
  bookmarkedLabel: string;
  handleEntryBookmark: () => void;
  shareLabel: string;
  onRepost: () => void;
  onRepostWithComment: () => void;
  onShare: (service: ServiceNames) => void;
  onLinkCopy: () => void;
}

const CardActions: React.FC<CardActionProps> = props => {
  const {
    repostsLabel,
    repliesLabel,
    isBookmarked,
    bookmarkLabel,
    bookmarkedLabel,
    handleEntryBookmark,
    shareLabel,
    onRepost,
    onRepostWithComment,
    onShare,
    onLinkCopy,
  } = props;

  const [replyDropOpen, setReplyDropOpen] = React.useState(false);
  const [shareDropOpen, setShareDropOpen] = React.useState(false);

  const replyNodeRef: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null);
  const shareNodeRef: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null);

  const handleRepostsOpen = () => {
    setReplyDropOpen(true);
  };
  const handleRepostsClose = () => {
    setReplyDropOpen(false);
  };

  const handleShareOpen = () => {
    setShareDropOpen(true);
  };

  const handleShareClose = () => {
    setShareDropOpen(false);
  };
  const handleShare = (service: ServiceNames) => () => {
    onShare(service);
  };
  return (
    <Box pad="medium" direction="row" justify="between">
      {replyNodeRef.current && replyDropOpen && (
        <StyledDrop
          target={replyNodeRef.current}
          align={{ top: 'bottom', left: 'left' }}
          onClickOutside={handleRepostsClose}
          onEsc={handleRepostsClose}
          overflow="hidden"
          style={{
            minWidth: '11em',
          }}
        >
          <Box pad="small" width={{ min: '3em' }}>
            <StyledSelectBox>
              <TextIcon iconType="reply" label={'Repost'} onClick={onRepost} clickable={true} />
            </StyledSelectBox>
            <StyledSelectBox>
              <TextIcon
                iconType="link"
                label={'Repost with comment'}
                onClick={onRepostWithComment}
                clickable={true}
              />
            </StyledSelectBox>
          </Box>
        </StyledDrop>
      )}
      <PlainButton label={repostsLabel} ref={replyNodeRef} onClick={handleRepostsOpen}>
        <Icon type="reply" />
      </PlainButton>
      <PlainButton label={repliesLabel}>
        <Icon type="comments" />
      </PlainButton>
      {isBookmarked !== null && (
        <PlainButton
          label={isBookmarked ? bookmarkedLabel : bookmarkLabel}
          onClick={handleEntryBookmark}
          color={isBookmarked ? 'accent' : 'secondaryText'}
        >
          <Icon
            type="bookmark"
            accentColor={isBookmarked}
            clickable={true}
            onClick={handleEntryBookmark}
          />
        </PlainButton>
      )}
      {shareNodeRef.current && shareDropOpen && (
        <StyledDrop
          target={shareNodeRef.current}
          align={{ top: 'bottom', left: 'left' }}
          onClickOutside={handleShareClose}
          onEsc={handleShareClose}
          overflow="hidden"
          style={{
            minWidth: '11em',
          }}
        >
          <Box pad="small" width={{ min: '3em' }}>
            <StyledSelectBox>
              <TextIcon iconType="link" label={'Copy Link'} onClick={onLinkCopy} clickable={true} />
            </StyledSelectBox>
            <StyledSelectBox>
              <TextIcon
                iconType="twitter"
                label={'Share on Twitter'}
                onClick={handleShare('twitter')}
                clickable={true}
                size="sm"
              />
            </StyledSelectBox>
            <StyledSelectBox>
              <TextIcon
                iconType="reddit"
                label={'Share on Reddit'}
                onClick={handleShare('reddit')}
                clickable={true}
                size="sm"
              />
            </StyledSelectBox>
            <StyledSelectBox>
              <TextIcon
                iconType="facebook"
                label={'Share on Facebook'}
                onClick={handleShare('facebook')}
                clickable={true}
                size="sm"
              />
            </StyledSelectBox>
          </Box>
        </StyledDrop>
      )}
      <PlainButton label={shareLabel} ref={shareNodeRef} onClick={handleShareOpen}>
        <Icon type="share" />
      </PlainButton>
    </Box>
  );
};

export default CardActions;
