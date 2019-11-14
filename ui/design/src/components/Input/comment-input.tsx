import { Box, Text, TextArea } from 'grommet';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import useSimpleClickAway from '../../utils/simpleClickAway';
import { Avatar } from '../Avatar/index';
import { Icon } from '../Icon/index';

interface ICommentInput {
  className?: string;
  avatarImg: any;
  placeholderTitle: string;
  publishTitle: string;
  onPublish: any;
}

const StyledDiv = styled.div`
  padding-right: ${props => `${props.theme.shapes.baseSpacing}px`};
  color: ${props => props.theme.colors.accent};
  opacity: 0.4;
  &:hover {
    cursor: pointer;
    opacity: 1;
  }
`;

const CommentInput: React.FC<ICommentInput> = props => {
  const { avatarImg, className, placeholderTitle, onPublish, publishTitle } = props;
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
    onPublish(inputValue);
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
      >
        <Text color="secondaryText">{placeholderTitle}</Text>
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
      >
        <TextArea
          plain={true}
          value={inputValue}
          onChange={onChange}
          placeholder={placeholderTitle}
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
            <Icon type="quoteDark" clickable={true} />
            <Icon type="media" clickable={true} />
            <Icon type="emoji" clickable={true} />
          </Box>
          <StyledDiv onClick={handlePublish}>
            <Text size="large">{publishTitle}</Text>
          </StyledDiv>
        </Box>
      </Box>
    );
  };

  return (
    <Box direction="row" gap="xsmall" fill="horizontal" pad="none" className={className}>
      <div>
        <Avatar src={avatarImg} size="md" />
      </div>

      {!textAreaOpen && renderFakeInput()}
      {textAreaOpen && renderTextArea()}
    </Box>
  );
};

export default CommentInput;
