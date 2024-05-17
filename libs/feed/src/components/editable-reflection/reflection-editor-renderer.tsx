import ReflectionEditor from '@akashaorg/design-system-components/lib/components/ReflectionEditor';
import { AkashaProfile, IPublishData } from '@akashaorg/typings/lib/ui';
import React, { useState } from 'react';
import { Descendant } from 'slate';
import { getLinkPreview, transformSource, encodeSlateToBase64 } from '@akashaorg/ui-awf-hooks';
import { ProfileImageVersions } from '@akashaorg/typings/lib/sdk/graphql-types-new';

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
  editorState: Descendant[];
  setEditorState: React.Dispatch<React.SetStateAction<Descendant[]>>;
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
    editorState,
    setEditorState,
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
      editorState={editorState}
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
      setEditorState={setEditorState}
      onCancelClick={onCancelClick}
      getLinkPreview={getLinkPreview}
      transformSource={transformSource}
      encodingFunction={encodeSlateToBase64}
    />
  );
};

export default ReflectionEditorRenderer;
