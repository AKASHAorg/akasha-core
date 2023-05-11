import React, { useRef, useState } from 'react';
import { Box, Text, TextArea } from 'grommet';
import useSimpleClickAway from '../../utils/simpleClickAway';
import Avatar from '../Avatar';
import Icon from '../Icon';
import { StyledDiv, StyledCommentWrapper } from './styled-comment-input';
import { Profile } from '@akashaorg/typings/sdk/graphql-types-new';

export interface ICommentInput {
  className?: string;
  avatarImg?: Profile['avatar'];
  profileId: string;
  placeholderLabel: string;
  publishLabel: string;
  onPublish: (inputValue: string, ethAddress: string) => void;
}

const CommentInput: React.FC<ICommentInput> = props => {
  const { avatarImg, profileId, className, placeholderLabel, onPublish, publishLabel } = props;
  const [inputValue, setInputValue] = useState('');
  const [textAreaOpen, setTextAreaOpen] = useState(false);

  const wrapperRef: React.Ref<HTMLDivElement> = useRef();

  const handleClickAway = () => {
    if (!inputValue && textAreaOpen) {
      setTextAreaOpen(false);
    }
  };

  useSimpleClickAway(wrapperRef, handleClickAway);

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  const handlePublish = () => {
    onPublish(inputValue, profileId);
    setInputValue('');
    setTextAreaOpen(false);
  };

  const handleFakeInputClick = () => {
    setTextAreaOpen(true);
  };

  const renderFakeInput = () => {
    return (
      <StyledCommentWrapper
        direction="row"
        align="center"
        height="2.5em"
        pad={{ horizontal: 'small', vertical: 'xsmall' }}
        round="small"
        border={{
          side: 'all',
          color: 'border',
        }}
        onClick={handleFakeInputClick}
        data-testid="fake-input-wrapper"
      >
        <Text color="secondaryText">{placeholderLabel}</Text>
      </StyledCommentWrapper>
    );
  };

  const renderTextArea = () => {
    return (
      <StyledCommentWrapper
        ref={wrapperRef}
        direction="column"
        align="center"
        round="small"
        border={{
          side: 'all',
          color: 'border',
        }}
        data-testid="textarea-wrapper-ref"
      >
        <TextArea
          plain={true}
          value={inputValue}
          onChange={onChange}
          placeholder={placeholderLabel}
          resize={false}
          autoFocus={true}
          data-testid="comment-textarea"
        />
        <Box
          direction="row"
          justify="between"
          fill="horizontal"
          pad={{ horizontal: 'xsmall', vertical: 'xsmall' }}
        >
          <Box direction="row" gap="xsmall" align="center">
            <Icon type="addAppGrey" clickable={true} />
            <Icon type="quote" clickable={true} />
            <Icon type="image" clickable={true} />
            <Icon type="emoji" clickable={true} />
          </Box>
          <StyledDiv onClick={handlePublish} data-testid="comment-publish-button">
            <Text size="large">{publishLabel}</Text>
          </StyledDiv>
        </Box>
      </StyledCommentWrapper>
    );
  };

  return (
    <Box direction="row" gap="xsmall" fill="horizontal" pad="none" className={className}>
      <Avatar avatar={avatarImg} profileId={profileId} size="md" />
      {!textAreaOpen && renderFakeInput()}
      {textAreaOpen && renderTextArea()}
    </Box>
  );
};

export default CommentInput;
