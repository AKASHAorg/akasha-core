import * as React from 'react';
import { tw } from '@twind/core';

import EditorBox, { EditorBoxProps } from '../Editor';
import { editorDefaultValue } from '../Editor/initialValue';

const ChatEditor: React.FC<Omit<EditorBoxProps, 'setEditorState'>> = props => {
  const {
    profileId,
    avatar,
    showAvatar = false,
    actionLabel,
    placeholderLabel,
    emojiPlaceholderLabel,
    disableActionLabel,
    disablePublish,
    onPublish,
    getMentions,
    getTags,
    mentions,
    tags,
    showCancelButton,
    cancelButtonLabel,
    onCancelClick,
    editorState,
    transformSource,
    encodingFunction,
  } = props;

  const [contentState, setContentState] = React.useState(editorState || editorDefaultValue);

  return (
    <div className={tw(`border(grey8 dark:grey3) m-1 rounded-lg bg(grey9 dark:grey2)`)}>
      <EditorBox
        avatar={avatar}
        showAvatar={showAvatar}
        profileId={profileId}
        actionLabel={actionLabel}
        placeholderLabel={placeholderLabel}
        emojiPlaceholderLabel={emojiPlaceholderLabel}
        disableActionLabel={disableActionLabel}
        disablePublish={disablePublish}
        onPublish={onPublish}
        getMentions={getMentions}
        getTags={getTags}
        mentions={mentions}
        tags={tags}
        withMeter={true}
        editorState={contentState}
        setEditorState={setContentState}
        cancelButtonLabel={cancelButtonLabel}
        onCancelClick={onCancelClick}
        transformSource={transformSource}
        showCancelButton={showCancelButton}
        encodingFunction={encodingFunction}
      />
    </div>
  );
};

export default ChatEditor;
