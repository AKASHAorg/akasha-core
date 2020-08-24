import { Box } from 'grommet';
import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { createEditor, Editor, Range, Transforms, Node, Text as SlateText } from 'slate';
import { withHistory } from 'slate-history';
import { Slate, withReact, ReactEditor } from 'slate-react';
import { Avatar } from '../Avatar/index';
import { IEntryData } from '../Cards/entry-cards/entry-box';
import { Icon } from '../Icon/index';
import { EmojiPopover, ImagePopover } from '../Popovers/index';
import EmbedBox from './embed-box';
import { FormatToolbar } from './format-toolbar';
import { CustomEditor } from './helpers';
import { defaultValue } from './initialValue';
import { withMentions, withImages } from './plugins';
import { renderElement, renderLeaf } from './renderers';
import { StyledBox, StyledEditable, StyledIconDiv, StyledMeterDiv } from './styled-editor-box';
import { Button } from '../Buttons';
import isHotkey from 'is-hotkey';
import { MentionPopover } from './mention-popover';

export interface IEditorBox {
  avatar?: string;
  ethAddress?: string;
  postLabel?: string;
  setLetterCount?: React.Dispatch<React.SetStateAction<number>>;
  placeholderLabel?: string;
  onPublish: any;
  embedEntryData?: IEntryData;
  minHeight?: string;
  withMeter?: any;
  mentions?: string[];
}

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
};

const EditorBox: React.FC<IEditorBox> = props => {
  const {
    avatar,
    ethAddress,
    postLabel,
    placeholderLabel,
    onPublish,
    embedEntryData,
    setLetterCount,
    minHeight,
    withMeter,
    mentions = [],
  } = props;

  const mentionPopoverRef: React.RefObject<HTMLDivElement> = useRef(null);
  const mediaIconRef: React.RefObject<HTMLDivElement> = useRef(null);
  const emojiIconRef: React.RefObject<HTMLDivElement> = useRef(null);

  const [editorValue, setEditorValue] = useState(defaultValue);
  const [targetRange, setTargetRange] = useState<Range | null>(null);
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState('');

  const [publishDisabled, setPublishDisabled] = useState(true);

  const [imagePopoverOpen, setImagePopoverOpen] = useState(false);
  const [emojiPopoverOpen, setEmojiPopoverOpen] = useState(false);

  const editor = useMemo(
    () => withMentions(withHistory(withReact(withImages(createEditor())))),
    [],
  );

  const mentionables = mentions
    .filter((c: string) => c.toLowerCase().startsWith(search.toLowerCase()))
    .slice(0, 10);

  useEffect(() => {
    countLetters();
    if (targetRange && mentionables && mentionables.length > 0) {
      const el = mentionPopoverRef.current;
      const domRange = ReactEditor.toDOMRange(editor, targetRange);
      const rect = domRange.getBoundingClientRect();
      if (el) {
        el.style.top = `${rect.top + window.pageYOffset + 20}px`;
        el.style.left = `${rect.left + window.pageXOffset}px`;
      }
    }
  }, [mentionables.length, editor, index, search, targetRange, editorValue]);

  const handlePublish = () => {
    const content = editorValue;
    onPublish(ethAddress, content);
  };

  const reducer = (acc: number, val: number) => acc + val;
  const countLetters = () => {
    const textLength = editor.children
      .map((node: Node) => {
        if (SlateText.isText(node)) return node.text.length;
        if (node.children) {
          return node.children
            .map(child => {
              if (SlateText.isText(child)) return child.text.length;
              return 0;
            })
            .reduce(reducer);
        }
        return 0;
      })
      .reduce(reducer);

    if (textLength > 0) {
      setPublishDisabled(false);
    } else if (textLength === 0) {
      setPublishDisabled(true);
    }
    if (typeof setLetterCount === 'function') {
      setLetterCount(textLength);
    }
  };

  const handleChange = (value: Node[]) => {
    setEditorValue(value);

    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const [start] = Range.edges(selection);
      const wordBefore = Editor.before(editor, start, { unit: 'word' });
      const before = wordBefore && Editor.before(editor, wordBefore);
      const beforeRange = before && Editor.range(editor, before, start);
      const beforeText = beforeRange && Editor.string(editor, beforeRange);
      const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/);
      const after = Editor.after(editor, start);
      const afterRange = Editor.range(editor, start, after);
      const afterText = Editor.string(editor, afterRange);
      const afterMatch = afterText.match(/^(\s|$)/);

      if (beforeMatch && afterMatch && beforeRange) {
        setTargetRange(beforeRange);
        setSearch(beforeMatch[1]);
        setIndex(0);
        return;
      }
    }

    setTargetRange(null);
  };

  const onKeyDown = useCallback(
    event => {
      for (const hotkey in HOTKEYS) {
        if (isHotkey(hotkey, event)) {
          event.preventDefault();
          const mark = HOTKEYS[hotkey];
          CustomEditor.toggleFormat(editor, mark);
        }
      }
      if (targetRange) {
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            const prevIndex = index >= mentionables.length - 1 ? 0 : index + 1;
            setIndex(prevIndex);
            break;
          case 'ArrowUp':
            event.preventDefault();
            const nextIndex = index <= 0 ? mentionables.length - 1 : index - 1;
            setIndex(nextIndex);
            break;
          case 'Tab':
          case 'Enter':
            event.preventDefault();
            Transforms.select(editor, targetRange);
            CustomEditor.insertMention(editor, mentionables[index]);
            setTargetRange(null);
            break;
          case 'Escape':
            event.preventDefault();
            setTargetRange(null);
            break;
        }
      }
    },
    [index, search, targetRange],
  );

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
    <StyledBox pad="none" justify="between">
      <Box
        direction="row"
        pad={{ horizontal: 'medium' }}
        align="start"
        overflow="auto"
        className="scrollBox"
        height={minHeight ? { min: minHeight } : undefined}
      >
        <Avatar src={avatar} ethAddress={ethAddress} margin={{ top: '0.5rem' }} />
        <Box width="100%" pad={{ horizontal: 'small' }} direction="row" justify="between">
          <Box fill={true}>
            <Slate editor={editor} value={editorValue} onChange={handleChange}>
              <FormatToolbar />
              <StyledEditable
                placeholder={placeholderLabel}
                spellCheck={false}
                autoFocus={true}
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                onKeyDown={onKeyDown}
              />
              {targetRange && mentionables.length > 0 && (
                <MentionPopover
                  ref={mentionPopoverRef}
                  values={mentionables}
                  currentIndex={index}
                />
              )}
            </Slate>
            {embedEntryData && <EmbedBox embedEntryData={embedEntryData} />}
          </Box>
          <StyledMeterDiv>{withMeter}</StyledMeterDiv>
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
  placeholderLabel: 'Share your thoughts',
};

export default EditorBox;
