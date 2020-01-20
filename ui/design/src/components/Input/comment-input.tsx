import { Box, Text, TextArea } from 'grommet';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import useSimpleClickAway from '../../utils/simpleClickAway';
import { Avatar } from '../Avatar/index';
import { Icon } from '../Icon/index';

export interface ICommentInput {
  className?: string;
  avatarImg?: string;
  ethAddress: string;
  placeholderLabel: string;
  publishLabel: string;
  onPublish: (inputValue: string, ethAddress: string) => void;
}

export const StyledDiv = styled.div`
  padding-right: ${props => `${props.theme.shapes.baseSpacing}px`};
  color: ${props => props.theme.colors.accent};
  opacity: 0.4;
  &:hover {
    cursor: pointer;
    opacity: 1;
  }
`;

const CommentInput: React.FC<ICommentInput> = props => {
  const { avatarImg, ethAddress, className, placeholderLabel, onPublish, publishLabel } = props;
  const [inputValue, setInputValue] = useState('');
  const [textAreaOpen, setTextAreaOpen] = useState(false);

  const wrapperRef: React.RefObject<any> = useRef();

  const handleClickAway = () => {
    if (!inputValue && textAreaOpen) {
      setTextAreaOpen(false);
    }
  };

  useSimpleClickAway(wrapperRef, handleClickAway);

  const onChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const handlePublish = () => {
    onPublish(inputValue, ethAddress);
    setInputValue('');
    setTextAreaOpen(false);
  };

  const handleFakeInputClick = () => {
    setTextAreaOpen(true);
  };

  const renderFakeInput = () => {
    return (
      <Box
        fill="horizontal"
        direction="row"
        align="center"
        height="40px"
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
      </Box>
    );
  };

  const renderTextArea = () => {
    return (
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
            <Icon type="addAppDark" clickable={true} />
            <Icon type="quote" clickable={true} />
            <Icon type="image" clickable={true} />
            <Icon type="emoji" clickable={true} />
          </Box>
          <StyledDiv onClick={handlePublish} data-testid="comment-publish-button">
            <Text size="large">{publishLabel}</Text>
          </StyledDiv>
        </Box>
      </Box>
    );
  };

  return (
    <Box direction="row" gap="xsmall" fill="horizontal" pad="none" className={className}>
      <Avatar src={avatarImg} ethAddress={ethAddress} size="md" />
      {!textAreaOpen && renderFakeInput()}
      {textAreaOpen && renderTextArea()}
    </Box>
  );
};

export default CommentInput;
