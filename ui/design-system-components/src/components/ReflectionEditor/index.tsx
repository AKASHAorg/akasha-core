import * as React from 'react';
import EditorPlaceholder from '../EditorPlaceholder';
import EditorBox, { EditorBoxProps } from '../Editor';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import isEqual from 'lodash.isequal';
import { editorDefaultValue } from '../Editor/initialValue';
import { useOnClickAway } from '../../utils/clickAway';
import { IPublishData } from '@akashaorg/typings/lib/ui';
import { Colors } from '@akashaorg/typings/lib/ui';

export type ReflectionEditorProps = EditorBoxProps & {
  placeholderButtonLabel?: string;
  showEditorInitialValue?: boolean;
  borderBottomOnly?: boolean;
  noBorderRound?: boolean;
  background?: { light: Colors; dark: Colors };
};

const ReflectionEditor: React.FC<ReflectionEditorProps> = props => {
  const {
    profileId,
    avatar,
    actionLabel,
    placeholderLabel,
    emojiPlaceholderLabel,
    disableActionLabel,
    disablePublish,
    linkPreview,
    mentions,
    tags,
    placeholderButtonLabel,
    showEditorInitialValue = false,
    showCancelButton,
    cancelButtonLabel,
    editorState = editorDefaultValue,
    embedEntryData,
    showDraft,
    uploadedImages,
    background,
    setEditorState,
    onPlaceholderClick,
    onCancelClick,
    uploadRequest,
    getLinkPreview,
    getMentions,
    getTags,
    onPublish,
    handleSaveImagesDraft,
    handleSaveLinkPreviewDraft,
    onClear,
  } = props;

  const [showEditor, setShowEditor] = React.useState(showEditorInitialValue);
  const wrapperRef: React.RefObject<HTMLDivElement> = React.useRef(null);
  const editorRef = React.useRef(null);

  const handleClickAway = () => {
    if (
      !showEditorInitialValue &&
      showEditor &&
      isEqual(editorState, editorDefaultValue) &&
      !editorRef.current?.getUploadingState() &&
      !editorRef.current?.getImagesState()
    ) {
      setShowEditor(false);
    }
  };

  React.useEffect(() => {
    setShowEditor(showEditorInitialValue);
  }, [showEditorInitialValue]);

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
    <Stack ref={wrapperRef} customStyle="grid">
      {!showEditor && (
        <EditorPlaceholder
          onClick={handleToggleEditor}
          profileId={profileId}
          avatar={avatar}
          buttonLabel={placeholderButtonLabel}
          placeholderLabel={placeholderLabel}
        />
      )}
      {showEditor && (
        <Card
          padding={0}
          accentBorder={true}
          background={!!background && background}
          customStyle="overflow-hidden"
        >
          <EditorBox
            ref={editorRef}
            avatar={avatar}
            profileId={profileId}
            actionLabel={actionLabel}
            placeholderLabel={placeholderLabel}
            emojiPlaceholderLabel={emojiPlaceholderLabel}
            disableActionLabel={disableActionLabel}
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
        </Card>
      )}
    </Stack>
  );
};

export default ReflectionEditor;
