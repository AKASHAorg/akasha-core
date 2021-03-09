import { Box } from 'grommet';
import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { createEditor, Editor, Range, Transforms, Node, Text as SlateText, Element } from 'slate';
import { withHistory } from 'slate-history';
import { Slate, withReact, ReactEditor, RenderElementProps } from 'slate-react';
import { Avatar } from '../Avatar/index';
import { IEntryData } from '../Cards/entry-cards/entry-box';
import { Icon } from '../Icon/index';
import { EmojiPopover } from '../Popovers/index';
import { EmbedBox } from './embed-box';
import { CustomEditor } from './helpers';
import { withMentions, withImages, withTags } from './plugins';
import { renderElement, renderLeaf } from './renderers';
import { StyledBox, StyledEditable, StyledIconDiv } from './styled-editor-box';
import { ImageUpload } from './image-upload';
import { Button } from '../Buttons';
import { MentionPopover } from './mention-popover';
import { EditorMeter } from './editor-meter';
import { serializeToPlainText } from './serialize';
import { editorDefaultValue } from './initialValue';
import { isMobile } from 'react-device-detect';

const MAX_LENGTH = 280;

export interface IEditorBox {
  avatar?: string;
  ethAddress: string | null;
  postLabel?: string;
  placeholderLabel?: string;
  uploadFailedLabel?: string;
  uploadingImageLabel?: string;
  onPublish: any;
  embedEntryData?: IEntryData;
  minHeight?: string;
  withMeter?: boolean;
  getMentions: (query: string) => void;
  getTags: (query: string) => void;
  mentions?: {
    name: string;
    userName: string;
    pubKey: string;
    avatar: string;
    ethAddress: string;
    description: string;
    coverImage: string;
  }[];
  tags?: { name: string; totalPosts: number }[];
  // upload an URL or a file and returns a promise that resolves to an array
  uploadRequest?: (data: string | File, isUrl?: boolean) => any;
  publishingApp?: string;
  editorState: any;
  setEditorState: any;
  ref?: React.Ref<any>;
}

export interface IMetadata {
  app: string;
  version: number;
  quote?: string;
  tags: string[];
  mentions: string[];
}

const EditorBox: React.FC<IEditorBox> = React.forwardRef((props, ref) => {
  const {
    avatar,
    ethAddress,
    postLabel,
    placeholderLabel,
    uploadFailedLabel,
    uploadingImageLabel,
    onPublish,
    embedEntryData,
    minHeight,
    withMeter,
    getMentions,
    getTags,
    mentions = [],
    tags = [],
    uploadRequest,
    publishingApp = 'AkashaApp',
    editorState,
    setEditorState,
  } = props;

  const mentionPopoverRef: React.RefObject<HTMLDivElement> = useRef(null);
  const mediaIconRef: React.RefObject<HTMLDivElement> = useRef(null);
  const emojiIconRef: React.RefObject<HTMLDivElement> = useRef(null);

  const [mentionTargetRange, setMentionTargetRange] = useState<Range | null>(null);
  const [tagTargetRange, setTagTargetRange] = useState<Range | null>(null);
  const [index, setIndex] = useState(0);
  const [createTag, setCreateTag] = React.useState('');

  const [letterCount, setLetterCount] = useState(0);

  const [publishDisabled, setPublishDisabled] = useState(true);
  const [imageUploadDisabled, setImageUploadDisabled] = useState(false);

  const [emojiPopoverOpen, setEmojiPopoverOpen] = useState(false);

  React.useImperativeHandle(
    ref,
    () => ({
      getPopoversState: () => {
        return emojiPopoverOpen;
      },
    }),
    [emojiPopoverOpen],
  );

  const editor = useMemo(
    () => withTags(withMentions(withHistory(withReact(withImages(createEditor()))))),
    [],
  );

  useEffect(() => {
    if (mentionTargetRange && mentions && mentions.length > 0) {
      const el = mentionPopoverRef.current;
      const domRange = ReactEditor.toDOMRange(editor, mentionTargetRange);
      const rect = domRange.getBoundingClientRect();
      if (el) {
        el.style.top = `${rect.top + window.pageYOffset + 20}px`;
        el.style.left = `${rect.left + window.pageXOffset}px`;
      }
    }
    if (tagTargetRange && tags && tags.length > 0) {
      const el = mentionPopoverRef.current;
      const domRange = ReactEditor.toDOMRange(editor, tagTargetRange);
      const rect = domRange.getBoundingClientRect();
      if (el) {
        el.style.top = `${rect.top + window.pageYOffset + 20}px`;
        el.style.left = `${rect.left + window.pageXOffset}px`;
      }
    }
  }, [mentions, tags, editor, index, mentionTargetRange, tagTargetRange, editorState]);

  const handlePublish = () => {
    const content: any = editorState;
    const metadata: IMetadata = {
      app: publishingApp,
      quote: embedEntryData?.entryId,
      tags: [],
      mentions: [],
      version: 1,
    };

    (function getMetadata(node: any) {
      if (node.type === 'mention') {
        metadata.mentions.push(node.pubKey as string);
      }
      if (node.type === 'tag') {
        metadata.tags.push(node.name as string);
      }
      if (node.children) {
        node.children.map((n: any) => getMetadata(n));
      }
    })({ children: content });
    const textContent: string = serializeToPlainText({ children: content });
    const data = { metadata, content, textContent, author: ethAddress };
    onPublish(data);
    setEditorState(editorDefaultValue);
  };

  const reducer = (acc: number, val: number) => acc + val;

  const handleChange = (value: Node[]) => {
    let imageCounter = 0;
    const textLength = value
      .map((node: Node) => {
        if (SlateText.isText(node)) return node.text.length;
        if (node.type === 'image') {
          imageCounter++;
        }
        if (node.children) {
          return node.children
            .map(child => {
              if (SlateText.isText(child)) return child.text.length;
              if (node.type === 'image') {
                imageCounter++;
              }
              return 0;
            })
            .reduce(reducer);
        }
        return 0;
      })
      .reduce(reducer);

    if ((textLength > 0 || imageCounter !== 0) && textLength <= MAX_LENGTH) {
      setPublishDisabled(false);
    } else if ((textLength === 0 && imageCounter === 0) || textLength > MAX_LENGTH) {
      setPublishDisabled(true);
    }

    if (imageCounter === 0) {
      setImageUploadDisabled(false);
    } else if (imageCounter > 0) {
      setImageUploadDisabled(true);
    }

    if (typeof setLetterCount === 'function') {
      setLetterCount(textLength);
    }

    setEditorState(value);

    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const [start] = Range.edges(selection);
      const wordBefore = Editor.before(editor, start, { unit: 'word' });
      const before = wordBefore && Editor.before(editor, wordBefore);
      const beforeRange = before && Editor.range(editor, before, start);
      const beforeText = beforeRange && Editor.string(editor, beforeRange);
      const beforeMentionMatch = beforeText && beforeText.match(/^@(\w+)$/);
      // todo: proper matching /^#([a-z0-9]*)(\-?|.?)([a-z0-9]*)$/
      const beforeTagMatch = beforeText && beforeText.match(/^#(\w+)$/);
      const after = Editor.after(editor, start);
      const afterRange = Editor.range(editor, start, after);
      const afterText = Editor.string(editor, afterRange);
      const afterMatch = afterText.match(/^(\s|$)/);

      if (beforeMentionMatch && afterMatch && beforeRange) {
        setMentionTargetRange(beforeRange);
        getMentions(beforeMentionMatch[1]);
        setIndex(0);
        return;
      }
      if (beforeTagMatch && afterMatch && beforeRange) {
        const tagName = beforeTagMatch[1];
        // .concat(beforeTagMatch[2], beforeTagMatch[3]);
        setTagTargetRange(beforeRange);
        getTags(tagName);
        setCreateTag(tagName);
        setIndex(0);
        return;
      }
    }

    setMentionTargetRange(null);
    setTagTargetRange(null);
  };

  const selectMention = (event: KeyboardEvent, mentionRange: Range) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        const prevIndex = index >= mentions.length - 1 ? 0 : index + 1;
        setIndex(prevIndex);
        break;
      case 'ArrowUp':
        event.preventDefault();
        const nextIndex = index <= 0 ? mentions.length - 1 : index - 1;
        setIndex(nextIndex);
        break;
      case 'Tab':
      case 'Enter':
      case ' ':
        event.preventDefault();
        Transforms.select(editor, mentionRange);
        CustomEditor.insertMention(editor, mentions[index]);
        setMentionTargetRange(null);
        break;
      case 'Escape':
        event.preventDefault();
        setMentionTargetRange(null);
        break;
    }
  };

  const selectTag = (event: KeyboardEvent, tagRange: Range) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        const prevIndex = index >= tags.length - 1 ? 0 : index + 1;
        setIndex(prevIndex);
        break;
      case 'ArrowUp':
        event.preventDefault();
        const nextIndex = index <= 0 ? tags.length - 1 : index - 1;
        setIndex(nextIndex);
        break;
      case 'Tab':
      case 'Enter':
        event.preventDefault();
        Transforms.select(editor, tagRange);
        CustomEditor.insertTag(editor, tags[index]);
        setTagTargetRange(null);
        break;
      case ' ':
        if (index === 0 && createTag.length > 1) {
          event.preventDefault();
          Transforms.select(editor, tagRange);
          CustomEditor.insertTag(editor, { name: createTag, totalPosts: 0 });
        } else {
          event.preventDefault();
          Transforms.select(editor, tagRange);
          CustomEditor.insertTag(editor, tags[index]);
        }
        setTagTargetRange(null);
        break;
      case 'Escape':
        event.preventDefault();
        setTagTargetRange(null);
        break;
    }
  };

  const onKeyDown = useCallback(
    event => {
      if (mentionTargetRange && mentions.length > 0) {
        selectMention(event, mentionTargetRange);
      }
      if (tagTargetRange && tags.length > 0) {
        selectTag(event, tagTargetRange);
      } else if (tagTargetRange && [9, 13, 32].includes(event.keyCode) && createTag.length > 1) {
        Transforms.select(editor, tagTargetRange);
        CustomEditor.insertTag(editor, { name: createTag, totalPosts: 0 });
        setTagTargetRange(null);
      }
    },
    [index, mentionTargetRange, tagTargetRange, mentions, tags],
  );

  const openEmojiPicker = () => {
    setEmojiPopoverOpen(!emojiPopoverOpen);
  };

  const closeEmojiPicker = () => {
    setEmojiPopoverOpen(false);
  };

  const handleInsertMention = (mentionIndex: number) => {
    if (mentionTargetRange && mentions.length > 0) {
      Transforms.select(editor, mentionTargetRange);
      CustomEditor.insertMention(editor, mentions[mentionIndex]);
      setMentionTargetRange(null);
    }
  };

  const handleInsertTag = (tagIndex: number) => {
    if (tagTargetRange && tags.length > 0) {
      Transforms.select(editor, tagTargetRange);
      CustomEditor.insertTag(editor, tags[tagIndex]);
      setTagTargetRange(null);
    }
  };

  const handleInsertEmoji = (emojiCode: string) => {
    CustomEditor.insertText(editor, emojiCode);
  };

  const mentionsNames = mentions.map(mention => {
    return mention.userName || mention.name || mention.ethAddress;
  });
  const tagsNames = tags.map(tag => tag.name);

  // image insertion

  const [uploading, setUploading] = React.useState(false);
  const uploadInputRef: React.RefObject<HTMLInputElement> = React.useRef(null);

  const handleInsertImageLink = (data: {
    src: string;
    size: {
      width: string;
      height: string;
      naturalWidth: string;
      naturalHeight: string;
    };
  }) => {
    if (!data.src || !data.size) {
      return;
    }
    CustomEditor.insertImage(editor, data.src, data.size);
  };

  const handleMediaClick = () => {
    if (uploadInputRef.current && !uploading && !imageUploadDisabled) {
      uploadInputRef.current.click();
    }
    return;
  };

  const handleDeleteImage = (element: Element) => {
    CustomEditor.deleteImage(editor, element);
  };

  return (
    <StyledBox pad="none" justify="between" fill={true} isMobile={isMobile}>
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
            <Slate editor={editor} value={editorState} onChange={handleChange}>
              <StyledEditable
                placeholder={placeholderLabel}
                spellCheck={false}
                autoFocus={true}
                renderElement={(renderProps: RenderElementProps) =>
                  renderElement(renderProps, () => null, handleDeleteImage)
                }
                renderLeaf={renderLeaf}
                onKeyDown={onKeyDown}
              />
              {mentionTargetRange && mentionsNames.length > 0 && (
                <MentionPopover
                  handleSelect={handleInsertMention}
                  ref={mentionPopoverRef}
                  values={mentionsNames}
                  currentIndex={index}
                />
              )}
              {tagTargetRange && tags.length > 0 && (
                <MentionPopover
                  handleSelect={handleInsertTag}
                  ref={mentionPopoverRef}
                  values={tagsNames}
                  currentIndex={index}
                />
              )}
            </Slate>
            {embedEntryData && (
              <Box pad={{ vertical: 'medium' }}>
                <EmbedBox embedEntryData={embedEntryData} />
              </Box>
            )}
            <ImageUpload
              uploading={uploading}
              setUploading={setUploading}
              uploadFailedLabel={uploadFailedLabel}
              uploadingImageLabel={uploadingImageLabel}
              uploadRequest={uploadRequest}
              handleInsertImage={handleInsertImageLink}
              ref={uploadInputRef}
            />
          </Box>
        </Box>
      </Box>
      <Box
        direction="row"
        justify="between"
        fill="horizontal"
        pad={{ horizontal: 'medium', top: 'xsmall', bottom: 'medium' }}
        flex={false}
      >
        <Box direction="row" gap="xsmall" align="center">
          {!isMobile && (
            <StyledIconDiv ref={emojiIconRef}>
              <Icon type="emoji" clickable={true} onClick={openEmojiPicker} size="md" />
            </StyledIconDiv>
          )}
          <StyledIconDiv ref={mediaIconRef}>
            <Icon
              type="image"
              clickable={!uploading && !imageUploadDisabled}
              onClick={handleMediaClick}
              size="md"
            />
          </StyledIconDiv>
        </Box>

        <Box direction="row" gap="small" align="center">
          {withMeter && <EditorMeter counter={letterCount} maxValue={MAX_LENGTH} />}
          <Button
            primary={true}
            icon={<Icon type="send" color="white" />}
            label={postLabel}
            onClick={handlePublish}
            disabled={publishDisabled}
          />
        </Box>
      </Box>
      {emojiPopoverOpen && emojiIconRef.current && (
        <EmojiPopover
          target={emojiIconRef.current}
          closePopover={closeEmojiPicker}
          onClickEmoji={handleInsertEmoji}
        />
      )}
    </StyledBox>
  );
});

EditorBox.defaultProps = {
  postLabel: 'Post',
  placeholderLabel: 'Share your thoughts',
  uploadingImageLabel: 'Uploading Image',
  uploadFailedLabel: 'Upload failed.',
};

export default EditorBox;
