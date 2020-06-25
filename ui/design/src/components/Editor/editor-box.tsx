import { Box, Text } from 'grommet';
import * as React from 'react';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { Slate, withReact } from 'slate-react';
import { Avatar } from '../Avatar/index';
import { IEntryData } from '../Cards/entry-cards/entry-box';
import { Icon } from '../Icon/index';
import { EmojiPopover, ImagePopover } from '../Popovers/index';
import EmbedBox from './embed-box';
import { FormatToolbar } from './format-toolbar';
import { CustomEditor } from './helpers';
import { defaultValue } from './initialValue';
import { withImages } from './plugins';
import { renderElement, renderLeaf } from './renderers';
import { StyledBox, StyledDiv, StyledEditable, StyledIconDiv } from './styled-editor-box';

export interface IEditorBox {
  avatar?: string;
  ethAddress?: string;
  publishLabel: string;
  placeholderLabel: string;
  onPublish: any;
  embedEntryData?: IEntryData;
}

const EditorBox: React.FC<IEditorBox> = props => {
  const { avatar, ethAddress, publishLabel, placeholderLabel, onPublish, embedEntryData } = props;

  const [editorValue, setEditorValue] = React.useState(defaultValue);

  const [imagePopoverOpen, setImagePopoverOpen] = React.useState(false);
  const [emojiPopoverOpen, setEmojiPopoverOpen] = React.useState(false);

  const editor = React.useMemo(() => withHistory(withReact(withImages(createEditor()))), []);

  const handlePublish = () => {
    const content = editorValue;
    onPublish(ethAddress, content);
  };

  const handleChange = (value: any) => {
    setEditorValue(value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<any>) => {
    if (!event.ctrlKey) {
      return;
    }

    switch (event.key) {
      case '`': {
        event.preventDefault();
        CustomEditor.toggleCodeBlock(editor);
        break;
      }

      case 'b': {
        event.preventDefault();
        CustomEditor.toggleBoldMark(editor);
        break;
      }
    }
  };

  const renderLeafMemo = React.useCallback(renderLeaf, []);

  const renderElementMemo = React.useCallback(renderElement, []);

  const mediaIconRef: React.RefObject<HTMLDivElement> = React.useRef(null);
  const emojiIconRef: React.RefObject<HTMLDivElement> = React.useRef(null);

  const handleMediaClick = () => {
    setImagePopoverOpen(!imagePopoverOpen);
  };

  const closeImagePopover = () => {
    setImagePopoverOpen(false);
  };

  const openEmojiPicker = () => {
    setEmojiPopoverOpen(!emojiPopoverOpen);
  };

  const closeEmojiPicker = () => {
    setEmojiPopoverOpen(false);
  };

  const handleInsertImageLink = (url: string) => {
    if (!url) {
      return;
    }
    CustomEditor.insertImage(editor, url);
  };

  const handleInsertEmoji = (emojiCode: string) => {
    CustomEditor.insertText(editor, emojiCode);
  };

  return (
    <StyledBox pad="none" width="581px" justify="between">
      <Box direction="row" pad="medium" align="start" overflow="auto" className="scrollBox">
        <Avatar src={avatar} ethAddress={ethAddress} />
        <Box width="480px" pad={{ horizontal: 'small' }}>
          <Slate editor={editor} value={editorValue} onChange={handleChange}>
            <FormatToolbar />
            <StyledEditable
              placeholder={placeholderLabel}
              spellCheck={false}
              autoFocus={true}
              renderElement={renderElementMemo}
              renderLeaf={renderLeafMemo}
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
          <Icon type="addAppGrey" clickable={true} />
          <Icon type="quote" clickable={true} />
          <StyledIconDiv ref={mediaIconRef}>
            <Icon type="image" clickable={true} onClick={handleMediaClick} />
          </StyledIconDiv>
          <StyledIconDiv ref={emojiIconRef}>
            <Icon type="emoji" clickable={true} onClick={openEmojiPicker} />
          </StyledIconDiv>
        </Box>
        <StyledDiv onClick={handlePublish}>
          <Text size="large">{publishLabel}</Text>
        </StyledDiv>
      </Box>
      {imagePopoverOpen && mediaIconRef.current && (
        <ImagePopover
          target={mediaIconRef.current}
          closePopover={closeImagePopover}
          insertImage={handleInsertImageLink}
        />
      )}
      {emojiPopoverOpen && emojiIconRef.current && (
        <EmojiPopover
          target={emojiIconRef.current}
          closePopover={closeEmojiPicker}
          onClickEmoji={handleInsertEmoji}
        />
      )}
    </StyledBox>
  );
};

export default EditorBox;
