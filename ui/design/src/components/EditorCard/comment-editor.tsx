import * as React from 'react';
import { Box } from 'grommet';
import { EditorPlaceholder } from './editor-placeholder';
import EditorBox, { IEditorBox } from '../Editor';
import { editorDefaultValue } from '../Editor/initialValue';
import { useOnClickAway } from '../../utils/clickAway';
import isEqual from 'lodash.isequal';
import { IPublishData } from '@akashaproject/ui-awf-typings/lib/entry';

const CommentEditor: React.FC<
  Omit<IEditorBox, 'editorState' | 'setEditorState'> & {
    isShown?: boolean;
  }
> = props => {
  const {
    ethAddress,
    avatar,
    postLabel,
    placeholderLabel,
    emojiPlaceholderLabel,
    onPublish,
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
  } = props;

  const [showEditor, setShowEditor] = React.useState(isShown);
  const [contentState, setContentState] = React.useState(editorDefaultValue);
  const wrapperRef: React.RefObject<HTMLDivElement> = React.useRef(null);
  const editorRef: React.RefObject<any> = React.useRef(null);

  const handleClickAway = () => {
    if (
      showEditor &&
      isEqual(contentState, editorDefaultValue) &&
      !editorRef.current?.getPopoversState()
    ) {
      setShowEditor(false);
    }
  };

  const handlePublish = (data: IPublishData) => {
    onPublish(data);
    if (props.isShown) {
      setShowEditor(false);
    }
  };

  useOnClickAway(wrapperRef, handleClickAway);

  const handleToggleEditor = (ev: React.SyntheticEvent) => {
    ev.stopPropagation();
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
        <Box border={{ side: 'all', size: '1px', color: 'border' }} pad="xxsmall" round="xsmall">
          <EditorBox
            ref={editorRef}
            avatar={avatar}
            ethAddress={ethAddress}
            postLabel={postLabel}
            placeholderLabel={placeholderLabel}
            emojiPlaceholderLabel={emojiPlaceholderLabel}
            onPublish={handlePublish}
            getLinkPreview={getLinkPreview}
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
      )}
    </Box>
  );
};

export { CommentEditor };
