import { Box, Text, Meter } from 'grommet';
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
import { StyledBox, StyledEditable, StyledIconDiv } from './styled-editor-box';
import { Button } from '../Buttons';

export interface IEditorBox {
  avatar?: string;
  ethAddress?: string;
  postLabel?: string;
  newPostLabel?: string;
  placeholderLabel?: string;
  onPublish: any;
  embedEntryData?: IEntryData;
  handleNavigateBack: () => void;
}

const EditorBox: React.FC<IEditorBox> = props => {
  const {
    avatar,
    ethAddress,
    postLabel,
    newPostLabel,
    placeholderLabel,
    onPublish,
    embedEntryData,
    handleNavigateBack,
  } = props;

  const [editorValue, setEditorValue] = React.useState(defaultValue);
  const [letterCount, setLetterCount] = React.useState(0);
  const [publishDisabled, setPublishDisabled] = React.useState(true);

  const [imagePopoverOpen, setImagePopoverOpen] = React.useState(false);
  const [emojiPopoverOpen, setEmojiPopoverOpen] = React.useState(false);

  const editor = React.useMemo(() => withHistory(withReact(withImages(createEditor()))), []);

  const handlePublish = () => {
    const content = editorValue;
    onPublish(ethAddress, content);
  };

  const handleChange = (value: any) => {
    const reducer = (acc: number, val: number) => acc + val;
    const textLength = value
      .map(({ children }: any) => {
        return children.map((child: any) => child.text.length).reduce(reducer);
      })
      .reduce(reducer);

    if (textLength > 0) {
      setPublishDisabled(false);
    } else if (textLength === 0) {
      setPublishDisabled(true);
    }

    setEditorValue(value);
    setLetterCount(textLength);
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
      <Box direction="row" justify="between" pad="medium" align="center" flex={false}>
        <Icon
          type="arrowLeft"
          onClick={handleNavigateBack}
          clickable={true}
          primaryColor={true}
          size="xs"
        />
        <Text size="large">{newPostLabel}</Text>
        <Meter
          max={300}
          size="20px"
          thickness="medium"
          background="#C6D1FF"
          type="circle"
          values={[{ value: letterCount, color: 'accent' }]}
        />
      </Box>

      <Box
        direction="row"
        pad={{ horizontal: 'medium' }}
        align="start"
        overflow="auto"
        className="scrollBox"
        height={{ min: '192px' }}
      >
        <Avatar src={avatar} ethAddress={ethAddress} margin={{ top: '0.5rem' }} />
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
        flex={false}
      >
        <Box direction="row" gap="xsmall" align="center">
          <StyledIconDiv ref={emojiIconRef}>
            <Icon type="emoji" clickable={true} onClick={openEmojiPicker} size="md" />
          </StyledIconDiv>
          <StyledIconDiv ref={mediaIconRef}>
            <Icon type="image" clickable={true} onClick={handleMediaClick} size="md" />
          </StyledIconDiv>
        </Box>

        <Icon type="akasha" clickable={true} style={{ marginLeft: '2rem' }} />

        <Button
          primary={true}
          icon={<Icon type="send" color="white" />}
          label={postLabel}
          onClick={handlePublish}
          disabled={publishDisabled}
        />
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

EditorBox.defaultProps = {
  postLabel: 'Post',
  newPostLabel: 'New Post',
  placeholderLabel: 'Share your thoughts',
};

export default EditorBox;
