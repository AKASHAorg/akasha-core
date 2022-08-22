import React from 'react';
import styled from 'styled-components';

import DS from '@akashaorg/design-system';

const { Box, Icon } = DS;

export interface IEditorToolbarProps {
  fontColor?: string;
  onEmojiIconClick: () => void;
  onFontColorClick: () => void;
  onTextCaseClick: () => void;
  onBoldClick: () => void;
  onItalicClick: () => void;
  onUnderlineClick: () => void;
  onStrikeThroughClick: () => void;
  onListStyleClick: () => void;
  onAlignStyleClick: () => void;
}

const StyledIcon = styled(Icon)`
  cursor: pointer;
`;

const EditorToolbar: React.FC<IEditorToolbarProps> = props => {
  const {
    fontColor = 'black',
    onEmojiIconClick,
    onFontColorClick,
    onTextCaseClick,
    onBoldClick,
    onItalicClick,
    onUnderlineClick,
    onStrikeThroughClick,
    onListStyleClick,
    onAlignStyleClick,
  } = props;

  return (
    <Box
      direction="row"
      justify="center"
      pad="small"
      gap="small"
      border={{ side: 'horizontal', color: 'border' }}
    >
      <StyledIcon type="emoji" size="md" onClick={onEmojiIconClick} />
      <Box direction="row" align="center" onClick={onFontColorClick}>
        <Box width="1.25rem" height="1.25rem" background={fontColor} round="xxsmall" />
        <Icon type="dropdown" />
      </Box>
      <Box direction="row" align="center" onClick={onTextCaseClick}>
        <Icon type="textcase" plain={true} />
        <Icon type="dropdown" />
      </Box>
      <StyledIcon type="boldAlt" onClick={onBoldClick} />
      <StyledIcon type="italic" plain={true} onClick={onItalicClick} />
      <StyledIcon type="underline" plain={true} onClick={onUnderlineClick} />
      <StyledIcon type="strikethrough" plain={true} onClick={onStrikeThroughClick} />
      <Box direction="row" align="center" onClick={onListStyleClick}>
        <Icon type="listBulleted" plain={true} />
        <Icon type="dropdown" />
      </Box>
      <Box direction="row" align="center" onClick={onAlignStyleClick}>
        <Icon type="alignLeft" size="sm" plain={true} />
        <Icon type="dropdown" />
      </Box>
    </Box>
  );
};

export default EditorToolbar;
