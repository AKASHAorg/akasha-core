import { Box, Text } from 'grommet';
import * as React from 'react';
import { createEditor, Editor } from 'slate';
import { withHistory } from 'slate-history';
import { Slate, withReact } from 'slate-react';
import { Avatar } from '../Avatar/index';
import { IEntryData } from '../Cards/entry-box';
import { Icon } from '../Icon/index';
import { EmojiPopover, ImagePopover } from '../Popovers/index';
import EmbedBox from './embed-box';
import { FormatToolbar } from './format-toolbar';
import { defaultValue } from './initialValue';
import { withFormatting, withImages } from './plugins';
import { renderElement, renderLeaf } from './renderers';
import { StyledBox, StyledDiv, StyledEditable, StyledIconDiv } from './styled-editor-box';

export interface IEditorBox {
  avatar?: string;
  ethAddress: string;
  publishLabel: string;
  placeholderLabel: string;
  onPublish: any;
  embedEntryData?: IEntryData;
}

const EditorBox: React.FC<IEditorBox> = props => {
  const { avatar, ethAddress, publishLabel, placeholderLabel, onPublish, embedEntryData } = props;

  const [editorValue, setEditorValue] = React.useState(defaultValue);
  const [editorSelection, setEditorSelection] = React.useState(null);

  const [imagePopoverOpen, setImagePopoverOpen] = React.useState(false);
  const [emojiPopoverOpen, setEmojiPopoverOpen] = React.useState(false);

  const editor = React.useMemo(
    () => withImages(withFormatting(withHistory(withReact(createEditor())))),
    [],
  );

  const handlePublish = () => {
    const content = editorValue;
    onPublish(ethAddress, content);
  };

  const handleChange = (value: any, selection: any) => {
    setEditorValue(value);
    setEditorSelection(selection);
  };

  const handleKeyDown = (event: React.KeyboardEvent<any>) => {
    if (!event.ctrlKey) {
      return;
    }

    switch (event.key) {
      case '`': {
        event.preventDefault();
        const [match] = Editor.nodes(editor, { match: { type: 'code' } });
        Editor.setNodes(editor, { type: match ? null : 'code' }, { match: 'block' });
        break;
      }

      case 'b': {
        event.preventDefault();
        Editor.setNodes(editor, { bold: true }, { match: 'text', split: true });
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
    editor.exec({ type: 'insert_image', url: url });
  };

  const handleInsertEmoji = (emojiCode: string) => {
    editor.exec({ type: 'insert_text', text: emojiCode });
  };

  return (
    <StyledBox pad="none" width="581px" justify="between">
      <Box direction="row" pad="medium" align="start" overflow="auto" className="scrollBox">
        <Avatar src={avatar} ethAddress={ethAddress} />
        <Box width="480px" pad={{ horizontal: 'small' }}>
          <Slate
            editor={editor}
            value={editorValue}
            selection={editorSelection}
            onChange={handleChange}
          >
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
          <Icon type="addAppDark" clickable={true} />
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
