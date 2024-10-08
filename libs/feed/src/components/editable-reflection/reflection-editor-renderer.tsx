import ReflectionEditor from '@akashaorg/design-system-components/lib/components/ReflectionEditor';
import { AkashaProfile, IPublishData } from '@akashaorg/typings/lib/ui';
import React, { useState } from 'react';
import { Descendant } from 'slate';
import { transformSource, encodeSlateToBase64 } from '@akashaorg/ui-awf-hooks';
import { ProfileImageVersions } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { EditorActions } from '@akashaorg/design-system-components/lib/components/Editor';

type ReflectionEditorRendererProps = {
  actionLabel: string;
  cancelButtonLabel: string;
  emojiPlaceholderLabel: string;
  disableActionLabel: string;
  placeholderButtonLabel: string;
  maxEncodedLengthErrLabel: string;
  avatar: ProfileImageVersions;
  profileId: string;
  disablePublish: boolean;
  initialEditorValue?: Descendant[];
  editorActionsRef?: React.RefObject<EditorActions>;
  mentions: AkashaProfile[];
  getMentions: (query: string) => void;
  onPublish: (data: IPublishData) => void;
  onCancelClick: () => void;
};

const ReflectionEditorRenderer: React.FC<ReflectionEditorRendererProps> = props => {
  const {
    actionLabel,
    cancelButtonLabel,
    emojiPlaceholderLabel,
    disableActionLabel,
    placeholderButtonLabel,
    maxEncodedLengthErrLabel,
    avatar,
    profileId,
    disablePublish,
    initialEditorValue,
    editorActionsRef,
    mentions,
    getMentions,
    onPublish,
    onCancelClick,
  } = props;

  const [showEditor, setShowEditor] = useState(true);

  return (
    <ReflectionEditor
      actionLabel={actionLabel}
      cancelButtonLabel={cancelButtonLabel}
      emojiPlaceholderLabel={emojiPlaceholderLabel}
      disableActionLabel={disableActionLabel}
      placeholderButtonLabel={placeholderButtonLabel}
      maxEncodedLengthErrLabel={maxEncodedLengthErrLabel}
      initialEditorValue={initialEditorValue}
      editorActionsRef={editorActionsRef}
      showEditor={showEditor}
      setShowEditor={setShowEditor}
      showCancelButton={true}
      avatar={avatar}
      profileId={profileId}
      disablePublish={disablePublish}
      mentions={mentions}
      getMentions={getMentions}
      background={{ light: 'white', dark: 'grey2' }}
      customStyle="px-2 pt-2"
      onPublish={onPublish}
      onCancelClick={onCancelClick}
      transformSource={transformSource}
      encodingFunction={encodeSlateToBase64}
    />
  );
};

export default ReflectionEditorRenderer;
