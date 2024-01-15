import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  createEditor,
  Editor,
  Range,
  Transforms,
  Text as SlateText,
  Element,
  Descendant,
} from 'slate';
import isUrl from 'is-url';
import { withHistory } from 'slate-history';
import { Editable, Slate, withReact, ReactEditor, RenderElementProps, useSlate } from 'slate-react';

import {
  IEntryData,
  IMetadata,
  IPublishData,
  type Image,
  Profile,
} from '@akashaorg/typings/lib/ui';

import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import {
  BoldAlt,
  Italic,
  Underline,
  ListNumbered,
  ListBulleted,
  AlignTextCenter,
  AlignTextLeft,
  AlignTextRight,
} from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import { ArrowPathIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import EditorMeter from '@akashaorg/design-system-core/lib/components/EditorMeter';

import { CustomEditor, TEXT_ALIGN_TYPES } from './helpers';
import { TagPopover } from './tag-popover';
import { serializeToPlainText } from './serialize';
import { MentionPopover } from './mention-popover';
import { editorDefaultValue } from './initialValue';
import { renderElement, renderLeaf } from './renderers';
import { withMentions, withTags, withLinks } from './plugins';

import EmbedBox from '../EmbedBox';
import LinkPreview from '../LinkPreview';

const MAX_LENGTH = 500;

/**
 * @param uploadRequest - upload a file and returns a promise that resolves to an array
 * @param editorState - the state of the editor is controlled from the parent component
 */
export type EditorBoxProps = {
  avatar?: Profile['avatar'];
  showAvatar?: boolean;
  profileId: string | null;
  actionLabel?: string;
  placeholderLabel?: string;
  emojiPlaceholderLabel?: string;
  disableActionLabel?: string;
  disablePublish?: boolean;
  embedEntryData?: IEntryData;
  minHeight?: string;
  withMeter?: boolean;
  withToolbar?: boolean;
  linkPreview?: IEntryData['linkPreview'];
  mentions?: Profile[];
  tags?: { name: string; totalPosts: number }[];
  publishingApp?: string;
  editorState?: Descendant[];
  ref?: React.Ref<unknown>;
  showCancelButton?: boolean;
  cancelButtonLabel?: string;
  showDraft?: boolean;
  showPostButton?: boolean;
  customStyle?: string;
  transformSource: (avatar: Image) => Image;
  onPublish: (publishData: IPublishData) => void;
  onClear?: () => void;
  onCancelClick?: () => void;
  handleSaveLinkPreviewDraft?: (LinkPreview: IEntryData['linkPreview']) => void;
  setEditorState: React.Dispatch<React.SetStateAction<Descendant[]>>;
  getLinkPreview?: (url: string) => Promise<IEntryData['linkPreview']>;
  getMentions: (query: string) => void;
  getTags: (query: string) => void;
  handleDisablePublish?: (value: any) => void;
};

/* eslint-disable complexity */
const EditorBox: React.FC<EditorBoxProps> = props => {
  const {
    avatar,
    showAvatar = true,
    // showDraft = false,
    // onClear,
    profileId,
    actionLabel,
    placeholderLabel,
    disableActionLabel,
    disablePublish,
    onPublish,
    embedEntryData,
    minHeight,
    withMeter,
    withToolbar,
    linkPreview,
    getLinkPreview,
    getMentions,
    getTags,
    mentions = [],
    tags = [],
    publishingApp = 'AkashaApp',
    editorState,
    setEditorState,
    cancelButtonLabel,
    onCancelClick,
    showCancelButton,
    showPostButton = true,
    transformSource,
    customStyle = '',
    handleDisablePublish,
  } = props;

  const mentionPopoverRef: React.RefObject<HTMLDivElement> = useRef(null);

  const [mentionTargetRange, setMentionTargetRange] = useState<Range | null>(null);
  const [tagTargetRange, setTagTargetRange] = useState<Range | null>(null);
  const [index, setIndex] = useState(0);
  const [createTag, setCreateTag] = useState('');

  const [letterCount, setLetterCount] = useState(0);

  const [publishDisabledInternal, setPublishDisabledInternal] = useState(true);

  const [linkPreviewState, setLinkPreviewState] = useState(linkPreview);
  const [linkPreviewUploading, setLinkPreviewUploading] = useState(false);

  const handleGetLinkPreview = async (url: string) => {
    setLinkPreviewUploading(true);
    const linkPreview = await getLinkPreview(url);
    setLinkPreviewState(linkPreview);
    setLinkPreviewUploading(false);
  };

  const handleDeletePreview = () => {
    setLinkPreviewState(null);
  };

  /**
   * display only 3 results in the tag and mention popovers
   */
  const slicedTags = React.useMemo(() => tags.slice(0, 3), [tags]);
  const slicedMentions = React.useMemo(() => mentions.slice(0, 3), [mentions]);

  /**
   * initialise editor with all the required plugins
   */
  const editorRef = useRef(
    withLinks(withTags(withMentions(withHistory(withReact(createEditor()))))),
  );

  const editor = editorRef.current;

  /**
   * insert links here to be able to access the image state
   * and prevent link preview generation when there are images
   * already uploaded or currently uploading
   */
  const { insertData, insertText } = editor;

  const handleInsertLink = (text: string) => {
    CustomEditor.insertLink(editor, { url: text.trim() });
    if (typeof getLinkPreview === 'function') {
      handleGetLinkPreview(text);
    }
  };

  editor.insertText = text => {
    if (text && isUrl(text.trim())) {
      handleInsertLink(text);
    } else {
      insertText(text);
    }
  };

  editor.insertData = data => {
    const text = data.getData('text/plain');
    if (text && isUrl(text.trim())) {
      handleInsertLink(text);
    } else {
      insertData(data);
    }
  };

  /**
   * set the selection at the end of the content when component is mounted
   */
  useEffect(() => {
    Transforms.select(editor, Editor.end(editor, []));
  }, [editor]);

  /**
   * position the mention and tag popovers based on the matching text range
   */
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

  /**
   * creates the object for publishing and resets the editor state after
   * metadata contains tags, mentions, quote, the publishing app and the version of the document
   * todo version should be passed as a prop
   */
  const handlePublish = () => {
    const slateContent = editorState;

    const metadata: IMetadata = {
      app: publishingApp,
      quote: embedEntryData,
      linkPreview: linkPreviewState,
      tags: [],
      mentions: [],
      version: 1,
    };

    /**
     * wrap slateContent in object to make recursive getMetadata work
     */
    const initContent: { children: Descendant[] } = { children: slateContent };
    (function getMetadata(node: Descendant | { children: Descendant[] }) {
      if (Element.isElement(node) && node.type === 'mention') {
        metadata.mentions.push(node.id);
      }
      if (Element.isElement(node) && node.type === 'tag') {
        metadata.tags.push(node.name);
      }
      if (Element.isElement(node) && node.children) {
        node.children.map((n: Descendant) => getMetadata(n));
      }
    })(initContent);
    const textContent: string = serializeToPlainText({ children: slateContent });
    const data = { metadata, slateContent, textContent, author: profileId };
    CustomEditor.clearEditor(editor);
    ReactEditor.focus(editor);
    onPublish(data);
  };

  /**
   *  computes the text length
   *  sets the editor state
   *  handles selection for mentions and tags
   */
  const handleChange = (value: Descendant[]) => {
    let textLength = 0;

    /**
     * include tags, mentions and links in the text length
     * keeps track of the number of images in the content
     */
    (function computeLength(nodeArr: Descendant[]) {
      if (nodeArr.length) {
        nodeArr.forEach((node: Descendant) => {
          if (SlateText.isText(node)) {
            textLength += node.text.length;
          }
          if (Element.isElement(node) && node.type === 'tag' && node.name?.length) {
            textLength += node.name?.length;
          }
          if (Element.isElement(node) && node.type === 'link' && node.url?.length) {
            textLength += node.url?.length;
          }
          if (Element.isElement(node) && node.children) {
            computeLength(node.children);
          }
        });
      }
    })(value);

    /** disable publishing if no images/text or text too long */
    if (textLength > 0 && textLength <= MAX_LENGTH) {
      setPublishDisabledInternal(false);
      handleDisablePublish?.(false);
    } else if (textLength === 0 || textLength > MAX_LENGTH) {
      setPublishDisabledInternal(true);
      handleDisablePublish?.(true);
    }

    if (typeof setLetterCount === 'function') {
      setLetterCount(textLength);
    }

    setEditorState(value);

    const { selection } = editor;

    /**
     * handles text matching for tags and mentions
     */
    if (selection && Range.isCollapsed(selection)) {
      const [start] = Range.edges(selection);
      const wordBefore = Editor.before(editor, start, { unit: 'word' });
      const before = wordBefore && Editor.before(editor, wordBefore);
      const beforeRange = before && Editor.range(editor, before, start);
      const beforeText = beforeRange && Editor.string(editor, beforeRange);
      const beforeMentionMatch = beforeText && beforeText.match(/^@(\w+)$/);
      // @todo: proper matching /^#([a-z0-9]*)(\-?|.?)([a-z0-9]*)$/
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
      } else {
        setMentionTargetRange(null);
      }

      /**
       * creates the target range for tags
       * setCreateTag is used for creating new tags from the matched text
       */
      if (beforeTagMatch && afterMatch && beforeRange) {
        const tagName = beforeTagMatch[1];
        // .concat(beforeTagMatch[2], beforeTagMatch[3]);
        setTagTargetRange(beforeRange);
        getTags(tagName);
        setCreateTag(tagName);
        setIndex(0);
        return;
      } else {
        setTagTargetRange(null);
      }
    }
  };

  const onKeyDown = useCallback(
    event => {
      /**
       * key handler for the mention popover
       * inserts the mention on tab, enter or space keypress
       */
      const selectMention = (event: KeyboardEvent, mentionRange: Range) => {
        switch (event.key) {
          case 'ArrowDown': {
            event.preventDefault();
            const prevIndex = index >= slicedMentions.length - 1 ? 0 : index + 1;
            setIndex(prevIndex);
            break;
          }
          case 'ArrowUp': {
            event.preventDefault();
            const nextIndex = index <= 0 ? slicedMentions.length - 1 : index - 1;
            setIndex(nextIndex);
            break;
          }
          case 'Tab':
          case 'Enter':
          case ' ':
            event.preventDefault();
            Transforms.select(editor, mentionRange);
            CustomEditor.insertMention(editor, slicedMentions[index]);
            setMentionTargetRange(null);
            break;
          case 'Escape':
            event.preventDefault();
            setMentionTargetRange(null);
            break;
        }
      };
      /**
       * key handler for the tag popover
       * inserts the tag on tab, enter keypress
       * if the user is still on the first position of the popover, on space keypress creates a  new tag
       * this handles new tag creation when we have tags matching the typed chars
       */
      const selectTag = (event: KeyboardEvent, tagRange: Range) => {
        switch (event.key) {
          case 'ArrowDown': {
            event.preventDefault();
            const prevIndex = index >= slicedTags.length - 1 ? 0 : index + 1;
            setIndex(prevIndex);
            break;
          }
          case 'ArrowUp': {
            event.preventDefault();
            const nextIndex = index <= 0 ? slicedTags.length - 1 : index - 1;
            setIndex(nextIndex);
            break;
          }
          case 'Tab':
          case 'Enter':
            event.preventDefault();
            Transforms.select(editor, tagRange);
            CustomEditor.insertTag(editor, slicedTags[index]);
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
              CustomEditor.insertTag(editor, slicedTags[index]);
            }
            setTagTargetRange(null);
            break;
          case 'Escape':
            event.preventDefault();
            setTagTargetRange(null);
            break;
        }
      };

      if (mentionTargetRange && mentions.length > 0) {
        selectMention(event, mentionTargetRange);
      }
      if (tagTargetRange && tags.length > 0) {
        selectTag(event, tagTargetRange);
        /**
         * handles new tag creation when there are no matches for the typed chars
         * user can create a new tag by pressing tab, enter or space
         */
      } else if (tagTargetRange && [9, 13, 32].includes(event.keyCode) && createTag.length > 1) {
        Transforms.select(editor, tagTargetRange);
        CustomEditor.insertTag(editor, { name: createTag, totalPosts: 0 });
        setTagTargetRange(null);
      }
    },
    [
      index,
      mentionTargetRange,
      tagTargetRange,
      mentions,
      tags,
      editor,
      slicedMentions,
      slicedTags,
      createTag,
    ],
  );

  /**
   * used for inserting mentions when clicking on popover
   */
  const handleInsertMention = (mentionIndex: number) => {
    if (mentionTargetRange && mentions.length > 0) {
      Transforms.select(editor, mentionTargetRange);
      CustomEditor.insertMention(editor, mentions[mentionIndex]);
      setMentionTargetRange(null);
    }
  };

  /**
   * used for inserting tags when clicking on popover
   */
  const handleInsertTag = (tagIndex: number) => {
    if (tagTargetRange && tags.length > 0) {
      Transforms.select(editor, tagTargetRange);
      CustomEditor.insertTag(editor, tags[tagIndex]);
      setTagTargetRange(null);
    }
  };

  // const handleInsertEmoji = (emojiCode: string) => {
  //   CustomEditor.insertText(editor, emojiCode);
  // };

  // image insertion

  const publishDisabled = publishDisabledInternal || disablePublish;

  const BlockButton = ({ format, icon }) => {
    const editor = useSlate();
    const active = CustomEditor.isBlockActive(
      editor,
      format,
      TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type',
    );
    return (
      <button
        onClick={event => {
          event.preventDefault();
          CustomEditor.toggleBlock(editor, format);
        }}
      >
        <Stack
          align="center"
          justify="center"
          customStyle="relative w-6 h-6 rounded-l-sm"
          background={
            active
              ? { light: 'secondaryLight/30', dark: 'grey4' }
              : { light: 'grey8', dark: 'grey3' }
          }
        >
          <Icon icon={icon} customStyle="absolute" solid accentColor />
        </Stack>
      </button>
    );
  };

  const MarkButton = ({ format, icon }) => {
    const editor = useSlate();
    const active = CustomEditor.isMarkActive(editor, format);
    return (
      <button
        onClick={event => {
          event.preventDefault();
          CustomEditor.toggleMark(editor, format);
        }}
      >
        <Stack
          align="center"
          justify="center"
          customStyle="relative w-6 h-6 rounded-l-sm"
          background={
            active
              ? { light: 'secondaryLight/30', dark: 'grey4' }
              : { light: 'grey8', dark: 'grey3' }
          }
        >
          <Icon icon={icon} customStyle="absolute" solid accentColor />
        </Stack>
      </button>
    );
  };
  return (
    <Stack
      justify="between"
      background={{ light: 'white', dark: 'grey2' }}
      fullWidth
      customStyle={customStyle}
    >
      <Stack
        direction="row"
        justify="start"
        spacing="gap-x-2"
        customStyle={`h-full ${showAvatar && `w-11/12`} ${minHeight && `min-h-[${minHeight}]`}`}
        fullWidth
      >
        {showAvatar && (
          <Stack padding="pb-2" customStyle="shrink-0">
            <Avatar
              avatar={transformSource(avatar?.default)}
              alternativeAvatars={avatar?.alternatives?.map(alternative =>
                transformSource(alternative),
              )}
              profileId={profileId}
            />
          </Stack>
        )}
        {/* w-0 min-w-full is used to prevent parent width expansion without setting a fixed width */}
        <Stack padding="py-2" customStyle="w-0 min-w-full">
          <Slate editor={editor} value={editorState || editorDefaultValue} onChange={handleChange}>
            <Editable
              placeholder={placeholderLabel}
              autoComplete="off"
              spellCheck={false}
              // autoFocus={true}
              renderElement={(renderProps: RenderElementProps) =>
                renderElement(
                  renderProps,
                  () => null,
                  () => null,
                  () => null,
                )
              }
              renderLeaf={renderLeaf}
              onKeyDown={onKeyDown}
            />
            {mentionTargetRange && mentions.length > 0 && (
              <MentionPopover
                handleSelect={handleInsertMention}
                ref={mentionPopoverRef}
                values={slicedMentions}
                currentIndex={index}
                setIndex={setIndex}
                transformSource={transformSource}
              />
            )}
            {tagTargetRange && tags.length > 0 && (
              <TagPopover
                handleSelect={handleInsertTag}
                ref={mentionPopoverRef}
                values={slicedTags}
                currentIndex={index}
                setIndex={setIndex}
              />
            )}
            <Stack
              padding={'pt-2'}
              direction="row"
              justify={withToolbar ? 'between' : 'end'}
              fullWidth
            >
              {withToolbar && (
                <Stack direction="row">
                  <MarkButton format="bold" icon={<BoldAlt />} />
                  <MarkButton format="italic" icon={<Italic />} />
                  <MarkButton format="underline" icon={<Underline />} />
                  <BlockButton format="left" icon={<AlignTextLeft />} />
                  <BlockButton format="center" icon={<AlignTextCenter />} />
                  <BlockButton format="right" icon={<AlignTextRight />} />
                  <BlockButton format="numbered-list" icon={<ListNumbered />} />
                  <BlockButton format="bulleted-list" icon={<ListBulleted />} />
                </Stack>
              )}
              <Stack direction="row" align="center" spacing="gap-x-2">
                {withMeter && <EditorMeter value={letterCount} max={MAX_LENGTH} />}
                {showCancelButton && <Button label={cancelButtonLabel} onClick={onCancelClick} />}
                {showPostButton && (
                  <Button
                    variant={'primary'}
                    icon={disablePublish ? <ArrowPathIcon /> : null}
                    label={disablePublish ? disableActionLabel : actionLabel}
                    onClick={handlePublish}
                    disabled={publishDisabled}
                  />
                )}
              </Stack>
            </Stack>
          </Slate>

          {(linkPreviewState || linkPreviewUploading) && (
            <LinkPreview
              uploading={linkPreviewUploading}
              linkPreviewData={linkPreviewState}
              handleDeletePreview={handleDeletePreview}
            />
          )}
          {embedEntryData && (
            <Stack padding="py-4">
              <EmbedBox embedEntryData={embedEntryData} transformSource={transformSource} />
            </Stack>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default EditorBox;
