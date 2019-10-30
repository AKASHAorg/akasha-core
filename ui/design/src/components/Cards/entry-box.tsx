import { Box, Layer, Text } from 'grommet';
import * as React from 'react';
import { formatDate, ILocale } from '../../utils/time';
import { Icon } from '../Icon/index';
import { IconLink, ProfileAvatarButton, VoteIconButton } from '../IconButton/index';
import { CommentInput } from '../Input/index';
import { TextIcon } from '../TextIcon';
import { StyledDrop, StyledLayerElemDiv, StyledSelectBox } from './styled-entry-box';

export interface IEntryData {
  user: string;
  userAvatar: string;
  content: string;
  time: string;
  upvotes: string | number;
  downvotes: string | number;
  comments?: Comment[];
  quotes?: Quote[];
}

interface Comment {
  user: string;
  time: string;
  userAvatar: string;
  content: string;
  upvotes: string | number;
  downvotes: string | number;
}

interface Quote {
  user: string;
  time: string;
  userAvatar: string;
}

interface IEntryBoxProps {
  entryData: IEntryData;
  onClickAvatar: React.EventHandler<React.SyntheticEvent>;
  onClickUpvote: React.EventHandler<React.SyntheticEvent>;
  onClickDownvote: React.EventHandler<React.SyntheticEvent>;
  commentsTitle: string;
  quotesTitle: string;
  shareTitle: string;
  editPostTitle: string;
  editCommentTitle: string;
  copyLinkTitle: string;
  quotedByTitle: string;
  replyTitle: string;
  comment?: boolean;
  locale?: ILocale;
  commentInputPlaceholderTitle?: any;
  commentInputPublishTitle?: any;
  publishComment?: any;
  userAvatar?: string;
}

const EntryBox: React.FC<IEntryBoxProps> = props => {
  const {
    entryData,
    onClickAvatar,
    onClickDownvote,
    onClickUpvote,
    commentsTitle,
    quotesTitle,
    shareTitle,
    editPostTitle,
    editCommentTitle,
    copyLinkTitle,
    quotedByTitle,
    replyTitle,
    comment,
    locale,
    commentInputPlaceholderTitle,
    commentInputPublishTitle,
    publishComment,
    userAvatar,
  } = props;

  const [downvoted, setDownvoted] = React.useState(false);
  const [upvoted, setUpvoted] = React.useState(false);
  const [upvotes, setUpvotes] = React.useState(entryData.upvotes);
  const [downvotes, setDownvotes] = React.useState(entryData.downvotes);
  const [menuDropOpen, setMenuDropOpen] = React.useState(false);
  const [quotesModalOpen, setQuotesModalOpen] = React.useState(false);

  React.useEffect(() => {
    setUpvotes(entryData.upvotes);
    setDownvotes(entryData.downvotes);
  }, [entryData]);

  const menuIconRef: React.Ref<any> = React.useRef();

  const commentsNumber = entryData.comments ? entryData.comments.length : 0;
  const quotesNumber = entryData.quotes ? entryData.quotes.length : 0;

  const commentsLabel = `${commentsNumber} ${commentsTitle}`;
  const quotesLabel = `${quotesNumber} ${quotesTitle}`;

  const editTitle = comment ? editCommentTitle : editPostTitle;

  const upvote = (ev: any) => {
    onClickUpvote(ev);
    if (!upvoted) {
      setUpvotes(Number(upvotes) + 1);
    }
    if (upvoted) {
      setUpvotes(Number(upvotes) - 1);
    }
    setUpvoted(!upvoted);
  };

  const downvote = (ev: any) => {
    onClickDownvote(ev);
    if (!downvoted) {
      setDownvotes(Number(downvotes) + 1);
    }
    if (downvoted) {
      setDownvotes(Number(downvotes) - 1);
    }
    setDownvoted(!downvoted);
  };

  const renderCommentsModal = () => {};

  const renderQuotesModal = () => {
    return (
      <Layer
        onEsc={() => setQuotesModalOpen(false)}
        onClickOutside={() => setQuotesModalOpen(false)}
        modal={true}
      >
        <Box pad="none" width="579px" height="386px">
          <Box pad="medium" justify="between" direction="row" align="center">
            <TextIcon iconType="quoteDark" label={quotedByTitle} margin={{ right: '40px' }} />
            <Text size="large" color="secondaryText">
              {quotesLabel}
            </Text>
          </Box>
          <Box pad={{ horizontal: 'medium' }} overflow="scroll">
            {entryData.quotes &&
              entryData.quotes.map((quote, index) => (
                <StyledLayerElemDiv key={index}>
                  <ProfileAvatarButton
                    info={formatDate(quote.time, locale)}
                    label={quote.user}
                    avatarImage={quote.userAvatar}
                    onClick={onClickAvatar}
                  />
                </StyledLayerElemDiv>
              ))}
          </Box>
        </Box>
      </Layer>
    );
  };
  const onClickEditPost = () => {};
  const onClickCopyLink = () => {};

  const renderMenu = () => {
    return (
      <StyledDrop
        overflow="hidden"
        target={menuIconRef.current}
        align={{ top: 'bottom', right: 'left' }}
        onClickOutside={() => setMenuDropOpen(false)}
        onEsc={() => setMenuDropOpen(false)}
      >
        <Box pad="small" gap="small" margin={{ right: 'small' }}>
          <StyledSelectBox>
            <TextIcon
              iconType="edit"
              label={editTitle}
              onClick={onClickEditPost}
              clickable={true}
            />
          </StyledSelectBox>
          <StyledSelectBox>
            <TextIcon
              iconType="link"
              label={copyLinkTitle}
              onClick={onClickCopyLink}
              clickable={true}
            />
          </StyledSelectBox>
        </Box>
      </StyledDrop>
    );
  };

  const border: any = comment
    ? {
        color: 'border',
        size: 'xsmall',
        style: 'solid',
        side: 'top',
      }
    : false;

  const pad: any = comment ? { top: 'medium' } : 'none';

  const replyToComment = () => {};

  const renderLeftIconLink = () => {
    return comment ? (
      <IconLink
        icon={<Icon type="reply" />}
        label={replyTitle}
        onClick={replyToComment}
        size="medium"
      />
    ) : (
      <IconLink
        icon={<Icon type="comments" />}
        label={commentsLabel}
        onClick={renderCommentsModal}
        size="medium"
      />
    );
  };
  return (
    <div>
      <Box direction="row" justify="between" margin="medium" pad={pad} border={border}>
        <ProfileAvatarButton
          label={entryData.user}
          info={formatDate(entryData.time, locale)}
          avatarImage={entryData.userAvatar}
          onClick={onClickAvatar}
        />
        <div ref={menuIconRef}>
          <Icon type="moreDark" onClick={() => setMenuDropOpen(true)} clickable={true} />
        </div>
      </Box>
      {menuIconRef.current && menuDropOpen && renderMenu()}
      {quotesModalOpen && renderQuotesModal()}
      <Box pad="medium">{entryData.content}</Box>
      <Box pad="medium" direction="row" justify="between">
        <Box gap="medium" direction="row">
          <VoteIconButton voteCount={upvotes} onClick={upvote} voteType="upvote" voted={upvoted} />
          <VoteIconButton
            voteCount={downvotes}
            onClick={downvote}
            voteType="downvote"
            voted={downvoted}
          />
        </Box>
        <Box gap="medium" direction="row">
          {renderLeftIconLink()}
          <IconLink
            icon={<Icon type="quoteDark" />}
            label={quotesLabel}
            onClick={() => setQuotesModalOpen(true)}
            size="medium"
          />
          <IconLink
            icon={<Icon type="share" />}
            label={shareTitle}
            onClick={() => {}}
            size="medium"
          />
        </Box>
      </Box>
      {!comment && (
        <Box pad="medium">
          <CommentInput
            avatarImg={userAvatar}
            placeholderTitle={commentInputPlaceholderTitle}
            publishTitle={commentInputPublishTitle}
            onPublish={publishComment}
          />
        </Box>
      )}
    </div>
  );
};

export default EntryBox;
