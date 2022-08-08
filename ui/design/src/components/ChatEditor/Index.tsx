import * as React from 'react';
import { Box } from 'grommet';
import EditorBox, { IEditorBox } from '../Editor';
import { editorDefaultValue } from '../Editor/initialValue';

const ChatEditor: React.FC<Omit<IEditorBox, 'setEditorState'>> = props => {
  const {
    ethAddress,
    avatar,
    showAvatar = false,
    postLabel,
    placeholderLabel,
    emojiPlaceholderLabel,
    disablePublishLabel,
    disablePublish,
    onPublish,
    getMentions,
    getTags,
    mentions,
    tags,
    uploadRequest,
    showCancelButton,
    cancelButtonLabel,
    onCancelClick,
    editorState,
  } = props;

  const [contentState, setContentState] = React.useState(editorState ?? editorDefaultValue);

  return (
    <Box
      border={{ side: 'all', size: '1px', color: 'border' }}
      margin="xsmall"
      background="chatBackground"
      round="small"
    >
      <EditorBox
        avatar={avatar}
        showAvatar={showAvatar}
        ethAddress={ethAddress}
        postLabel={postLabel}
        placeholderLabel={placeholderLabel}
        emojiPlaceholderLabel={emojiPlaceholderLabel}
        disablePublishLabel={disablePublishLabel}
        disablePublish={disablePublish}
        onPublish={onPublish}
        getMentions={getMentions}
        getTags={getTags}
        mentions={mentions}
        tags={tags}
        uploadRequest={uploadRequest}
        withMeter={true}
        editorState={contentState}
        setEditorState={setContentState}
        cancelButtonLabel={cancelButtonLabel}
        onCancelClick={onCancelClick}
        showCancelButton={showCancelButton}
      />
    </Box>
  );
};

export { ChatEditor };
