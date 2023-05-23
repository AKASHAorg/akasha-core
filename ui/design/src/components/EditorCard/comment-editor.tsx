import * as React from 'react';
import { Box, BoxProps } from 'grommet';
import { EditorPlaceholder } from './editor-placeholder';
import EditorBox, { IEditorBox } from '../Editor';
import { editorDefaultValue } from '../Editor/initialValue';
import { useOnClickAway } from '../../utils/clickAway';
import isEqual from 'lodash.isequal';
import { IPublishData } from '@akashaorg/typings/ui';

export type CommentEditorProps = IEditorBox & {
  openEditor?: boolean;
  borderBottomOnly?: boolean;
  noBorderRound?: boolean;
  background?: BoxProps['background'];
};

const CommentEditor: React.FC<CommentEditorProps> = props => {
  const {
    profileId,
    avatar,
    postLabel,
    placeholderLabel,
    emojiPlaceholderLabel,
    disablePublishLabel,
    disablePublish,
    onPublish,
    handleSaveImagesDraft,
    handleSaveLinkPreviewDraft,
    linkPreview,
    getLinkPreview,
    getMentions,
    getTags,
    mentions,
    tags,
    uploadRequest,
    openEditor = false,
    showCancelButton,
    cancelButtonLabel,
    onCancelClick,
    editorState = editorDefaultValue,
    onPlaceholderClick,
    embedEntryData,
    setEditorState,
    showDraft,
    uploadedImages,
    borderBottomOnly,
    noBorderRound,
    onClear,
  } = props;

  const [showEditor, setShowEditor] = React.useState(openEditor);
  const wrapperRef: React.RefObject<HTMLDivElement> = React.useRef(null);
  const editorRef = React.useRef(null);

  const handleClickAway = () => {
    if (
      !openEditor &&
      showEditor &&
      isEqual(editorState, editorDefaultValue) &&
      !editorRef.current?.getPopoversState() &&
      !editorRef.current?.getUploadingState() &&
      !editorRef.current?.getImagesState()
    ) {
      setShowEditor(false);
    }
  };

  React.useEffect(() => {
    setShowEditor(openEditor);
  }, [openEditor]);

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
          profileId={profileId}
          avatar={avatar}
          placeholderLabel={placeholderLabel}
        />
      )}
      {showEditor && (
        <Box
          border={{ side: borderBottomOnly ? 'bottom' : 'all', size: '1px', color: 'border' }}
          pad="xxsmall"
          round={noBorderRound ? false : 'xsmall'}
          background={props.background}
        >
          <EditorBox
            ref={editorRef}
            avatar={avatar}
            profileId={profileId}
            postLabel={postLabel}
            placeholderLabel={placeholderLabel}
            emojiPlaceholderLabel={emojiPlaceholderLabel}
            disablePublishLabel={disablePublishLabel}
            disablePublish={disablePublish}
            onPublish={handlePublish}
            handleSaveImagesDraft={handleSaveImagesDraft}
            handleSaveLinkPreviewDraft={handleSaveLinkPreviewDraft}
            linkPreview={linkPreview}
            getLinkPreview={getLinkPreview}
            getMentions={getMentions}
            getTags={getTags}
            mentions={mentions}
            tags={tags}
            uploadRequest={uploadRequest}
            uploadedImages={uploadedImages}
            withMeter={true}
            editorState={editorState}
            setEditorState={setEditorState}
            cancelButtonLabel={cancelButtonLabel}
            onCancelClick={onCancelClick}
            showCancelButton={showCancelButton}
            embedEntryData={embedEntryData}
            showDraft={showDraft}
            onClear={onClear}
          />
        </Box>
      )}
    </Box>
  );
};

export { CommentEditor };
