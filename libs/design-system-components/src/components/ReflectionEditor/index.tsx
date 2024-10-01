import React, { forwardRef } from 'react';
import EditorPlaceholder from '../EditorPlaceholder';
import EditorBox, { EditorBoxProps } from '../Editor';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import { editorDefaultValue } from '../Editor/initialValue';
import { Colors, IPublishData } from '@akashaorg/typings/lib/ui';

export type ReflectionEditorProps = EditorBoxProps & {
  placeholderButtonLabel?: string;
  borderBottomOnly?: boolean;
  noBorderRound?: boolean;
  background?: { light: Colors; dark: Colors };
  customStyle?: string;
  showEditor?: boolean;
  setShowEditor: (showEditor: boolean) => void;
};

/**
 * Component used as a text editor for posting reflections (comments)
 * It is a wrapper over the slate.js based akasha editor, containing
 * also the placeholder component for when the editor is inactive.
 * Upon clicking the placeholder the user opens the editor.
 * @param placeholderButtonLabel - text for the placeholder action button
 * @param borderBottomOnly - style option to display a border only on the bottom
 * @param noBorderRound - style option to override rounded borders
 * @param customStyle - add custom tailwind styles for the wrapper
 * @param showEditor - whether to display the placeholder or the actual editor
 * @param setShowEditor - toggle between editor and placeholder
 */
const ReflectionEditor = forwardRef<HTMLDivElement, ReflectionEditorProps>((props, ref) => {
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
    mentions,
    noMentionsLabel,
    tags,
    placeholderButtonLabel,
    showCancelButton,
    cancelButtonLabel,
    editorState = editorDefaultValue,
    showDraft,
    background,
    customStyle = '',
    editorActionsRef,
    setEditorState,
    onCancelClick,
    getMentions,
    getTags,
    onPublish,
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
    <Stack ref={ref} customStyle={customStyle}>
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
          padding={'p-4'}
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
            mentions={mentions}
            noMentionsLabel={noMentionsLabel}
            tags={tags}
            withMeter={true}
            editorState={editorState}
            cancelButtonLabel={cancelButtonLabel}
            showCancelButton={showCancelButton}
            showDraft={showDraft}
            maxEncodedLength={3000}
            editorActionsRef={editorActionsRef}
            setEditorState={setEditorState}
            onPublish={handlePublish}
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
});

export default ReflectionEditor;
