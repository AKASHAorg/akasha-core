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
import { tw } from '@twind/core';
import { withHistory } from 'slate-history';
import { Popover } from '@headlessui/react';
import { Editable, Slate, withReact, ReactEditor, RenderElementProps } from 'slate-react';

import { IEntryData, IMetadata, IPublishData, Profile } from '@akashaorg/typings/lib/ui';

import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import EditorMeter from '@akashaorg/design-system-core/lib/components/EditorMeter';

import { CustomEditor } from './helpers';
import { TagPopover } from './tag-popover';
import { serializeToPlainText } from './serialize';
import { MentionPopover } from './mention-popover';
import { editorDefaultValue } from './initialValue';
import { ImageData, ImageUpload } from './image-upload';
import { renderElement, renderLeaf } from './renderers';
import { withMentions, withImages, withTags, withLinks } from './plugins';

import EmbedBox from '../EmbedBox';
import LinkPreview from '../LinkPreview';
import ImageGallery from '../ImageGallery';
import { ImageObject } from '../ImageGallery/image-grid-item';

const MAX_LENGTH = 280;

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
  uploadFailedLabel?: string;
  uploadingImageLabel?: string;
  disablePublishLabel?: string;
  onPublish: (publishData: IPublishData) => void;
  disablePublish?: boolean;
  embedEntryData?: IEntryData;
  minHeight?: string;
  withMeter?: boolean;
  handleSaveImagesDraft?: (images: IEntryData['images']) => void;
  handleSaveLinkPreviewDraft?: (LinkPreview: IEntryData['linkPreview']) => void;
  linkPreview?: IEntryData['linkPreview'];
  uploadedImages?: IEntryData['images'];
  getLinkPreview?: (url: string) => Promise<IEntryData['linkPreview']>;
  getMentions: (query: string) => void;
  getTags: (query: string) => void;
  mentions?: Profile[];
  tags?: { name: string; totalPosts: number }[];
  uploadRequest?: (
    data: string | File,
    isUrl?: boolean,
  ) => Promise<{ data?: ImageData; error?: Error }>;
  publishingApp?: string;
  editorState?: Descendant[];
  setEditorState: React.Dispatch<React.SetStateAction<Descendant[]>>;
  ref?: React.Ref<unknown>;
  showCancelButton?: boolean;
  onCancelClick?: () => void;
  cancelButtonLabel?: string;
  onPlaceholderClick?: () => void;
  showDraft?: boolean;
  onClear?: () => void;
  showPostButton?: boolean;
};

/* eslint-disable complexity */
const EditorBox: React.FC<EditorBoxProps> = React.forwardRef((props, ref) => {
  const {
    avatar,
    showAvatar = true,
    showDraft = false,
    onClear,
    profileId,
    actionLabel,
    placeholderLabel,
    uploadFailedLabel,
    uploadingImageLabel,
    disablePublishLabel,
    disablePublish,
    onPublish,
    embedEntryData,
    minHeight,
    withMeter,
    handleSaveImagesDraft,
    handleSaveLinkPreviewDraft,
    linkPreview,
    uploadedImages = [],
    getLinkPreview,
    getMentions,
    getTags,
    mentions = [],
    tags = [],
    uploadRequest,
    publishingApp = 'AkashaApp',
    editorState,
    setEditorState,
    cancelButtonLabel,
    onCancelClick,
    showCancelButton,
    showPostButton = true,
  } = props;

  const mentionPopoverRef: React.RefObject<HTMLDivElement> = useRef(null);
  const uploadInputRef: React.RefObject<HTMLInputElement> = React.useRef(null);

  const [mentionTargetRange, setMentionTargetRange] = useState<Range | null>(null);
  const [tagTargetRange, setTagTargetRange] = useState<Range | null>(null);
  const [index, setIndex] = useState(0);
  const [createTag, setCreateTag] = useState('');

  const [letterCount, setLetterCount] = useState(0);

  const [publishDisabledInternal, setPublishDisabledInternal] = useState(true);
  const [imageUploadDisabled, setImageUploadDisabled] = useState(false);

  const [linkPreviewState, setLinkPreviewState] = useState(linkPreview);
  const [linkPreviewUploading, setLinkPreviewUploading] = useState(false);

  const [uploading, setUploading] = React.useState(false);
  const [images, setImages] = React.useState<ImageObject[]>(uploadedImages);

  const handleGetLinkPreview = async (url: string) => {
    setLinkPreviewUploading(true);
    const linkPreview = await getLinkPreview(url);
    setLinkPreviewState(linkPreview);
    handleSaveLinkPreviewDraft(linkPreview);
    setLinkPreviewUploading(false);
  };

  const handleDeletePreview = () => {
    setLinkPreviewState(null);
    handleSaveLinkPreviewDraft(null);
  };

  /**
   * display only 3 results in the tag and mention popovers
   */
  const slicedTags = React.useMemo(() => tags.slice(0, 3), [tags]);
  const slicedMentions = React.useMemo(() => mentions.slice(0, 3), [mentions]);

  /**
   * this is needed to check internal state from the parent component
   * to prevent closing the comment editor when the user has uploaded images
   * or has an open popover
   */
  React.useImperativeHandle(
    ref,
    () => ({
      getImagesState: () => {
        return images.length > 0;
      },
      getUploadingState: () => {
        return uploading;
      },
    }),
    [images, uploading],
  );

  /**
   * initialise editor with all the required plugins
   */
  const editorRef = useRef(
    withLinks(withTags(withMentions(withImages(withHistory(withReact(createEditor())))))),
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
    if (images.length === 0 && !uploading && typeof getLinkPreview === 'function') {
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
      images: images,
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
    if ((textLength > 0 || images.length !== 0) && textLength <= MAX_LENGTH) {
      setPublishDisabledInternal(false);
    } else if ((textLength === 0 && images.length === 0) || textLength > MAX_LENGTH) {
      setPublishDisabledInternal(true);
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

  const handleInsertImageLink = (data: ImageData) => {
    if (!data.src || !data.size) {
      return;
    }
    if (images.length > 7) {
      setImageUploadDisabled(true);
    }
    // clear any existing link preview when inserting an image
    if (linkPreviewState) {
      setLinkPreviewState(null);
      handleSaveLinkPreviewDraft(null);
    }
    const imgData = { ...data, id: `${Date.now()}-${data.src?.url}` };
    if (images.length < 9) {
      setImages(prev => {
        handleSaveImagesDraft([...prev, imgData]);
        return [...prev, imgData];
      });
    }
    setPublishDisabledInternal(false);

    // CustomEditor.insertImage(editor, data.src, data.size);
  };

  /**
   * disable uploading media if there is a picture uploading or max number of images already
   */
  const handleMediaClick = () => {
    if (uploadInputRef.current && !uploading && !imageUploadDisabled) {
      uploadInputRef.current.click();
    }
  };

  const handleDeleteImage = (element: ImageObject) => {
    const newImages = images.filter(image => image.id !== element.id);
    if (newImages.length < 9) {
      setImageUploadDisabled(false);
    }
    if (newImages.length === 0) {
      setPublishDisabledInternal(true);
    }
    setImages(newImages);
    handleSaveImagesDraft(newImages);
    // CustomEditor.deleteImage(editor, element);
  };

  const publishDisabled = publishDisabledInternal || disablePublish || uploading;

  return (
    <div
      className={tw(
        `flex flex-col justify-between w-full bg(white dark:grey2) h-[45vh] md:max-h-[38rem]`,
      )}
    >
      <div
        className={tw(
          `flex flex-row items-start h-full w-full p-2 overflow-auto ${
            minHeight && `min-h-[${minHeight}]`
          }`,
        )}
      >
        {showAvatar && (
          <div className={tw(`flex shrink-0 pb-2`)}>
            <Avatar avatar={avatar} profileId={profileId} />
          </div>
        )}
        <div className={tw(`w-full p-2 flex flex-col overflow-auto`)}>
          <div className={tw(`w-full flex flex-col`)}>
            <Slate
              editor={editor}
              value={editorState || editorDefaultValue}
              onChange={handleChange}
            >
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
            </Slate>
            <ImageUpload
              uploading={uploading}
              setUploading={setUploading}
              uploadFailedLabel={uploadFailedLabel}
              uploadingImageLabel={uploadingImageLabel}
              uploadRequest={uploadRequest}
              handleInsertImage={handleInsertImageLink}
              ref={uploadInputRef}
            />
            {images?.length > 0 && (
              <ImageGallery images={images} handleDeleteImage={handleDeleteImage} />
            )}
            {(linkPreviewState || linkPreviewUploading) && (
              <LinkPreview
                uploading={linkPreviewUploading}
                linkPreviewData={linkPreviewState}
                handleDeletePreview={handleDeletePreview}
              />
            )}
            {embedEntryData && (
              <div className={tw(`py-4 flex`)}>
                <EmbedBox embedEntryData={embedEntryData} />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={tw(`flex flex-row w-full p-2 justify-between`)}>
        <div className={tw(`flex flex-row gap-2 items-center`)}>
          <div className={tw('sm:hidden')}>
            <Popover className="relative">
              <Popover.Button>
                <Icon type="FaceSmileIcon" accentColor={true} />
              </Popover.Button>
              <Popover.Panel className="absolute z-10">
                <Popover.Button>
                  {/* <Picker data={data} onEmojiSelect={handleInsertEmoji} /> */}
                </Popover.Button>
              </Popover.Panel>
            </Popover>
          </div>
          {uploadRequest && (
            <button className={tw(`flex items-center`)} onClick={handleMediaClick}>
              <Icon
                accentColor={true}
                type="PhotoIcon"
                disabled={uploading || imageUploadDisabled}
              />
            </button>
          )}
        </div>

        <div className={tw(`flex flex-row gap-2 items-center`)}>
          {/* {showDraft && (
            <div className={tw(`flex flex-row gap-2 items-center`)}>
              {!publishDisabled && (
                <p className={tw(`text(secondaryLight dark:secondaryDark)`)}>Draft</p>
              )}
              <button
                className={tw(`text-color-secondaryLight dark:textColorSecondaryDark`)}
                onClick={e => {
                  e.preventDefault();
                  CustomEditor.clearEditor(editor);
                  if (onClear) onClear();
                }}
              >
                Clear
              </button>
            </div>
          )} */}
          {withMeter && <EditorMeter value={letterCount} max={MAX_LENGTH} />}
          {showCancelButton && <Button label={cancelButtonLabel} onClick={onCancelClick} />}
          {showPostButton && (
            <Button
              variant={'primary'}
              icon={disablePublish ? 'ArrowPathIcon' : null}
              label={disablePublish ? disablePublishLabel : actionLabel}
              onClick={handlePublish}
              disabled={publishDisabled}
            />
          )}
        </div>
      </div>
    </div>
  );
});

export default EditorBox;
