import * as React from 'react';
import { Box, BoxProps } from 'grommet';
import { EditorPlaceholder } from './editor-placeholder';
import EditorBox, { IEditorBox } from '../Editor';
import { editorDefaultValue } from '../Editor/initialValue';
import { useOnClickAway } from '../../utils/clickAway';
import isEqual from 'lodash.isequal';
import { IPublishData } from '@akashaorg/typings/ui';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

const CommentEditor: React.FC<
  Optional<IEditorBox, 'setEditorState'> & {
    isShown?: boolean;
    background?: BoxProps['background'];
  }
> = props => {
  const {
    ethAddress,
    avatar,
    postLabel,
    placeholderLabel,
    emojiPlaceholderLabel,
    disablePublishLabel,
    disablePublish,
    onPublish,
    linkPreview,
    getLinkPreview,
    getMentions,
    getTags,
    mentions,
    tags,
    uploadRequest,
    isShown = false,
    showCancelButton,
    cancelButtonLabel,
    onCancelClick,
    editorState = editorDefaultValue,
    onPlaceholderClick,
    embedEntryData,
    setEditorState,
    showDraft,
  } = props;

  const [showEditor, setShowEditor] = React.useState(isShown);
  const [contentState, setContentState] = React.useState(editorState);
  const wrapperRef: React.RefObject<HTMLDivElement> = React.useRef(null);
  const editorRef = React.useRef(null);

  const handleClickAway = () => {
    if (
      showEditor &&
      isEqual(contentState, editorDefaultValue) &&
      !editorRef.current?.getPopoversState() &&
      !editorRef.current?.getUploadingState() &&
      !editorRef.current?.getImagesState()
    ) {
      setShowEditor(false);
    }
  };

  const handlePublish = (data: IPublishData) => {
    onPublish(data);
    setShowEditor(false);
  };

  useOnClickAway(wrapperRef, handleClickAway);

  const handleToggleEditor = (ev: React.SyntheticEvent) => {
    ev.stopPropagation();
    if (onPlaceholderClick) {
      onPlaceholderClick();
    }
    setShowEditor(!showEditor);
  };

  return (
    <Box ref={wrapperRef}>
      {!showEditor && (
        <EditorPlaceholder
          onClick={handleToggleEditor}
          ethAddress={ethAddress}
          avatar={avatar}
          placeholderLabel={placeholderLabel}
        />
      )}
      {showEditor && (
        <Box
          border={{ side: 'all', size: '1px', color: 'border' }}
          pad="xxsmall"
          round="xsmall"
          background={props.background}
        >
          <EditorBox
            ref={editorRef}
            avatar={avatar}
            ethAddress={ethAddress}
            postLabel={postLabel}
            placeholderLabel={placeholderLabel}
            emojiPlaceholderLabel={emojiPlaceholderLabel}
            disablePublishLabel={disablePublishLabel}
            disablePublish={disablePublish}
            onPublish={handlePublish}
            linkPreview={linkPreview}
            getLinkPreview={getLinkPreview}
            getMentions={getMentions}
            getTags={getTags}
            mentions={mentions}
            tags={tags}
            uploadRequest={uploadRequest}
            withMeter={true}
            editorState={contentState}
            setEditorState={value => {
              setContentState(value);
              if (setEditorState) setEditorState(value);
            }}
            cancelButtonLabel={cancelButtonLabel}
            onCancelClick={onCancelClick}
            showCancelButton={showCancelButton}
            embedEntryData={embedEntryData}
            showDraft={showDraft}
          />
        </Box>
      )}
    </Box>
  );
};

export { CommentEditor };
