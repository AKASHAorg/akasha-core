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
  customStyle?: string;
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
    background,
    customStyle,
    setEditorState,
    onCancelClick,
    getLinkPreview,
    getMentions,
    getTags,
    onPublish,
    handleSaveLinkPreviewDraft,
    onClear,
    transformSource,
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
    setShowEditor(!showEditor);
  };

  return (
    <Stack ref={wrapperRef} customStyle={customStyle}>
      {!showEditor && (
        <EditorPlaceholder
          onClick={handleToggleEditor}
          profileId={profileId}
          avatar={avatar}
          actionLabel={placeholderButtonLabel}
          placeholderLabel={placeholderLabel}
          transformSource={transformSource}
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
            linkPreview={linkPreview}
            mentions={mentions}
            tags={tags}
            withMeter={true}
            editorState={editorState}
            cancelButtonLabel={cancelButtonLabel}
            showCancelButton={showCancelButton}
            embedEntryData={embedEntryData}
            showDraft={showDraft}
            setEditorState={setEditorState}
            onPublish={handlePublish}
            handleSaveLinkPreviewDraft={handleSaveLinkPreviewDraft}
            getLinkPreview={getLinkPreview}
            getMentions={getMentions}
            getTags={getTags}
            onClear={onClear}
            onCancelClick={onCancelClick}
            transformSource={transformSource}
          />
        </Card>
      )}
    </Stack>
  );
};

export default ReflectionEditor;
