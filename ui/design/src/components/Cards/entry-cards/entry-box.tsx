import { Box, Text, TextArea } from 'grommet';
import * as React from 'react';
import useSimpleClickAway from '../../../utils/simpleClickAway';
import { formatDate, ILocale } from '../../../utils/time';
import { Avatar } from '../../Avatar/index';
import { PlainButton, ProfileAvatarButton, VoteIconButton } from '../../Buttons/index';
import { Icon } from '../../Icon/index';
import { CommentInput, StyledDiv } from '../../Input/index';
import { EditorModal, ListModal } from '../../Modals/index';
import { TextIcon } from '../../TextIcon/index';
import { StyledDrop, StyledSelectBox } from './styled-entry-box';

export interface IUser {
  name?: string;
  avatar?: string;
  ethAddress: string;
}

export interface IEntryData extends IUser {
  content: string;
  time: string;
  upvotes: string | number;
  downvotes: string | number;
  comments?: Comment[];
  quotes: Quote[];
}

export interface Comment extends IUser {
  content: string;
  time: string;
  upvotes: string | number;
  downvotes: string | number;
  quotes: Quote[];
}

export interface Quote extends IUser {
  time: string;
}
export type ethAddress = string;
export interface IEntryBoxProps {
  entryData: IEntryData;
  onClickAvatar: React.MouseEventHandler<HTMLAnchorElement>;
  onClickUpvote: React.EventHandler<React.SyntheticEvent>;
  onClickDownvote: React.EventHandler<React.SyntheticEvent>;
  commentsLabel: string;
  quotesLabel: string;
  shareLabel: string;
  editPostLabel: string;
  editCommentLabel: string;
  copyLinkLabel: string;
  quotedByLabel: string;
  replyLabel: string;
  comment?: boolean;
  locale: ILocale;
  commentInputPlaceholderLabel?: any;
  commentInputPublishLabel?: any;
  publishComment?: any;
  loggedProfileAvatar?: string;
  loggedProfileEthAddress: string;
}

const EntryBox: React.FC<IEntryBoxProps> = props => {
  const {
    entryData,
    onClickAvatar,
    onClickDownvote,
    onClickUpvote,
    commentsLabel,
    quotesLabel,
    shareLabel,
    editPostLabel,
    editCommentLabel,
    copyLinkLabel,
    quotedByLabel,
    replyLabel,
    comment,
    locale,
    commentInputPlaceholderLabel,
    commentInputPublishLabel,
    publishComment,
    loggedProfileAvatar,
    loggedProfileEthAddress,
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

  const commentsTitle = `${commentsNumber} ${commentsLabel}`;
  const quotesTitle = `${quotesNumber} ${quotesLabel}`;

  const editLabel = comment ? editCommentLabel : editPostLabel;

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

  const renderCommentsModal = () => {
    return;
  };

  const closeQuotesModal = () => {
    setQuotesModalOpen(false);
  };

  const toggleQuotesModal = () => {
    setQuotesModalOpen(!quotesModalOpen);
  };

  const renderQuotesModal = () => {
    return (
      <ListModal
        closeModal={closeQuotesModal}
        label={quotedByLabel}
        secondaryLabel={quotesTitle}
        list={entryData.quotes}
        onClickAvatar={onClickAvatar}
        locale={locale}
        iconType="quote"
      />
    );
  };
  const onClickEditPost = () => {
    return;
  };
  const onClickCopyLink = () => {
    return;
  };

  const closeMenuDrop = () => {
    setMenuDropOpen(false);
  };

  const toggleMenuDrop = () => {
    setMenuDropOpen(!menuDropOpen);
  };

  const renderMenu = () => {
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
              iconType="edit"
              label={editLabel}
              onClick={onClickEditPost}
              clickable={true}
            />
          </StyledSelectBox>
          <StyledSelectBox>
            <TextIcon
              iconType="link"
              label={copyLinkLabel}
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

  const [replyCommentOpen, setReplyCommentOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');

  const wrapperRef: React.RefObject<any> = React.useRef();

  const handleClickAway = () => {
    if (!inputValue && replyCommentOpen) {
      setReplyCommentOpen(false);
    }
  };

  useSimpleClickAway(wrapperRef, handleClickAway);

  const onChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const handlePublish = () => {
    publishComment(inputValue, loggedProfileEthAddress);
    setInputValue('');
    setReplyCommentOpen(false);
  };

  const replyToComment = () => {
    setReplyCommentOpen(true);
  };

  const renderReplyComment = () => (
    <Box direction="row" gap="xsmall" fill="horizontal" pad={{ horizontal: 'medium' }}>
      <Avatar src={loggedProfileAvatar} ethAddress={loggedProfileEthAddress} size="md" />
      <Box
        ref={wrapperRef}
        fill="horizontal"
        direction="column"
        align="center"
        round="small"
        border={{
          side: 'all',
          color: 'border',
        }}
      >
        <TextArea
          plain={true}
          value={inputValue}
          onChange={onChange}
          placeholder={commentInputPlaceholderLabel}
          resize={false}
          autoFocus={true}
        />
        <Box
          direction="row"
          justify="between"
          fill="horizontal"
          pad={{ horizontal: 'xsmall', vertical: 'xsmall' }}
        >
          <Box direction="row" gap="xsmall" align="center">
            <Icon type="addAppDark" clickable={true} />
            <Icon type="quote" clickable={true} />
            <Icon type="media" clickable={true} />
            <Icon type="emoji" clickable={true} />
          </Box>
          <StyledDiv onClick={handlePublish}>
            <Text size="large">{commentInputPublishLabel}</Text>
          </StyledDiv>
        </Box>
      </Box>
    </Box>
  );

  const renderLeftIconLink = () => {
    return comment ? (
      <PlainButton label={replyLabel} onClick={replyToComment}>
        <Icon type="reply" />
      </PlainButton>
    ) : (
      <PlainButton label={commentsTitle} onClick={renderCommentsModal}>
        <Icon type="comments" />
      </PlainButton>
    );
  };

  const [editorModalOpen, setEditorModalOpen] = React.useState(false);
  const openEditorModal = () => {
    setEditorModalOpen(true);
  };
  const closeEditorModal = () => {
    setEditorModalOpen(false);
  };

  return (
    <div>
      <Box direction="row" justify="between" margin="medium" pad={pad} border={border}>
        <ProfileAvatarButton
          label={entryData.name}
          info={formatDate(entryData.time, locale)}
          avatarImage={entryData.avatar}
          onClick={onClickAvatar}
          ethAddress={entryData.ethAddress}
        />
        <div ref={menuIconRef}>
          <Icon type="moreDark" onClick={toggleMenuDrop} clickable={true} />
        </div>
      </Box>
      {menuIconRef.current && menuDropOpen && renderMenu()}
      {quotesModalOpen && entryData.quotes!.length && locale && renderQuotesModal()}
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

          <PlainButton label={quotesLabel} onClick={toggleQuotesModal}>
            <Icon type="quote" onClick={openEditorModal} clickable={true} />
          </PlainButton>

          <PlainButton
            label={shareLabel}
            onClick={
              // tslint:disable-next-line:jsx-no-lambda
              () => {
                return;
              }
            }
          >
            <Icon type="share" />
          </PlainButton>
        </Box>
      </Box>
      {editorModalOpen && (
        <EditorModal
          closeModal={closeEditorModal}
          avatar={loggedProfileAvatar}
          ethAddress={loggedProfileEthAddress}
          onPublish={publishComment}
          publishLabel={commentInputPublishLabel}
          placeholderLabel={commentInputPlaceholderLabel}
          embedEntryData={entryData}
        />
      )}
      {comment && replyCommentOpen && renderReplyComment()}
      {!comment && (
        <Box pad="medium">
          <CommentInput
            avatarImg={loggedProfileAvatar}
            ethAddress={loggedProfileEthAddress}
            placeholderLabel={commentInputPlaceholderLabel}
            publishLabel={commentInputPublishLabel}
            onPublish={publishComment}
          />
        </Box>
      )}
    </div>
  );
};

export default EntryBox;
