import React from 'react';
import EditorPlaceholder from '../EditorPlaceholder';
import EditorBox, { EditorBoxProps } from '../Editor';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import { editorDefaultValue } from '../Editor/initialValue';
import { IPublishData } from '@akashaorg/typings/lib/ui';
import { Colors } from '@akashaorg/typings/lib/ui';

export type ReflectionEditorProps = EditorBoxProps & {
  placeholderButtonLabel?: string;
  showEditor?: boolean;
  borderBottomOnly?: boolean;
  noBorderRound?: boolean;
  background?: { light: Colors; dark: Colors };
  customStyle?: string;
  setShowEditor: (showEditor: boolean) => void;
};

const ReflectionEditor: React.FC<ReflectionEditorProps> = props => {
  const {
    profileId,
    avatar,
    actionLabel,
    placeholderLabel,
    showEditor,
    emojiPlaceholderLabel,
    disableActionLabel,
    maxEncodedLengthErrLabel,
    disablePublish,
    linkPreview,
    mentions,
    tags,
    placeholderButtonLabel,
    showCancelButton,
    cancelButtonLabel,
    editorState = editorDefaultValue,
    showDraft,
    background,
    customStyle = '',
    setEditorState,
    onCancelClick,
    getLinkPreview,
    getMentions,
    getTags,
    onPublish,
    handleSaveLinkPreviewDraft,
    onClear,
    transformSource,
    encodingFunction,
    setShowEditor,
  } = props;

  const handlePublish = (data: IPublishData) => {
    onPublish(data);
    setShowEditor(false);
  };

  const handleToggleEditor = (ev: React.SyntheticEvent) => {
    ev.stopPropagation();
    setShowEditor(!showEditor);
  };

  return (
    <Stack customStyle={customStyle}>
      {!showEditor && (
        <EditorPlaceholder
          onClick={handleToggleEditor}
          profileId={profileId}
          avatar={avatar}
          actionLabel={placeholderButtonLabel}
          placeholderLabel={placeholderLabel}
          isReflection={true}
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
            avatar={avatar}
            profileId={profileId}
            actionLabel={actionLabel}
            placeholderLabel={placeholderLabel}
            emojiPlaceholderLabel={emojiPlaceholderLabel}
            disableActionLabel={disableActionLabel}
            maxEncodedLengthErrLabel={maxEncodedLengthErrLabel}
            disablePublish={disablePublish}
            linkPreview={linkPreview}
            mentions={mentions}
            tags={tags}
            withMeter={true}
            editorState={editorState}
            cancelButtonLabel={cancelButtonLabel}
            showCancelButton={showCancelButton}
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
            encodingFunction={encodingFunction}
          />
        </Card>
      )}
    </Stack>
  );
};

export default ReflectionEditor;
