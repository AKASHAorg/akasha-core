import { Box, Text } from 'grommet';
import * as React from 'react';
import { createEditor } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';
// import { withHistory } from 'slate-history'
import styled from 'styled-components';
import { Avatar } from '../Avatar/index';
import { IEntryData } from '../Cards/entry-box';
import { Icon } from '../Icon/index';
import { EmojiPopover, ImagePopover } from '../Popovers/index';
import EmbedBox from './embed-box';
import { FormatToolbar } from './format-toolbar';
// import { html } from './html-serialize';
import { defaultValue } from './initialValue';
import { withMarks, withImages } from './plugins';
import { renderElement, renderMark } from './renderers';

export interface IEditorBox {
  avatar?: string;
  ethAddress: string;
  publishTitle: string;
  placeholderTitle: string;
  onPublish: any;
  embedEntryData?: IEntryData;
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

const StyledIconDiv = styled.div`
  display: flex;
  align-items: center;
`;

const StyledBox = styled(Box)`
  min-height: 200px;
  max-height: 612px;
`;

const StyledEditable = styled(Editable)`
  ::selection {
    background-color: ${props => props.theme.colors.accent};
  }
`;

const EditorBox: React.FC<IEditorBox> = props => {
  const { avatar, ethAddress, publishTitle, placeholderTitle, onPublish, embedEntryData } = props;

  const [editorState, setEditorState] = React.useState(defaultValue);

  const [imagePopoverOpen, setImagePopoverOpen] = React.useState(false);
  const [emojiPopoverOpen, setEmojiPopoverOpen] = React.useState(false);

  const editor = React.useMemo(() => withImages(withMarks(withReact(createEditor()))), []);

  const handlePublish = () => {
    const content = editorState;
    console.log(content);
    onPublish(ethAddress, editorState);
  };

  const handleChange = ({ value }: any) => {
    setEditorState(value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<any>) => {
    if (!event.ctrlKey) {
      return;
    }

    switch (event.key) {
      case '`': {
        event.preventDefault();
        editor.exec({ type: 'toggle_code_block' });
        break;
      }

      case 'b': {
        event.preventDefault();
        editor.exec({ type: 'toggle_bold_mark' });
        break;
      }
    }
  };

  const renderMarkMemo = React.useCallback(renderMark, []);

  const renderElementMemo = React.useCallback(renderElement, []);

  const mediaIconRef: React.RefObject<any> = React.useRef(null);

  const handleMediaClick = () => {
    setImagePopoverOpen(true);
  };

  const closeImagePopover = () => {
    setImagePopoverOpen(false);
  };

  const openEmojiPicker = () => {
    setEmojiPopoverOpen(true);
  };

  const closeEmojiPicker = () => {
    setEmojiPopoverOpen(false);
  };

  const handleInsertImageLink = (url: string) => {
    console.log('URL: ', url);
    if (!url) {
      return;
    }
    editor.exec({ type: 'insert_image', url: url });
  };

  const handleInsertEmoji = (emojiCode: string) => {
    console.log('Emoji: ', emojiCode);
    editor.exec({ type: 'insert_text', text: emojiCode });
  };

  return (
    <StyledBox pad="none" width="581px" justify="between">
      <Box direction="row" pad="medium" align="start" overflow="auto" className="scrollBox">
        <Avatar seed={ethAddress} src={avatar} />
        <Box width="480px" pad={{ horizontal: 'small' }}>
          <Slate editor={editor} defaultValue={defaultValue}>
            <FormatToolbar />
            <StyledEditable
              placeholder={placeholderTitle}
              spellCheck={false}
              autoFocus={true}
              renderElement={renderElementMemo}
              renderMark={renderMarkMemo}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </Slate>
          {embedEntryData && <EmbedBox embedEntryData={embedEntryData} />}
        </Box>
      </Box>
      <Box
        direction="row"
        justify="between"
        fill="horizontal"
        pad={{ horizontal: 'medium', vertical: 'xsmall' }}
      >
        <Box direction="row" gap="xsmall" align="center">
          <Icon type="addAppDark" clickable={true} />
          <Icon type="quote" clickable={true} />
          <StyledIconDiv ref={mediaIconRef}>
            <Icon type="media" clickable={true} onClick={handleMediaClick} />
          </StyledIconDiv>
          <StyledIconDiv ref={mediaIconRef}>
            <Icon type="emoji" clickable={true} onClick={openEmojiPicker} />
          </StyledIconDiv>
        </Box>
        <StyledDiv onClick={handlePublish}>
          <Text size="large">{publishTitle}</Text>
        </StyledDiv>
      </Box>
      {imagePopoverOpen && (
        <ImagePopover
          target={mediaIconRef.current}
          closePopover={closeImagePopover}
          insertImageLink={handleInsertImageLink}
        />
      )}
      {emojiPopoverOpen && (
        <EmojiPopover
          target={mediaIconRef.current}
          closePopover={closeEmojiPicker}
          onClickEmoji={handleInsertEmoji}
        />
      )}
    </StyledBox>
  );
};

export default EditorBox;
