import * as React from 'react';
import { IEditorBox } from '../../Editor/editor-box';
import { Box } from 'grommet';
import { EditorPlaceholder } from './editor-placeholder';
import { EditorBox, defaultValue } from '../../Editor/index';
import useSimpleClickAway from '../../../utils/simpleClickAway';
import isEqual from 'lodash.isequal';

const CommentEditor: React.FC<IEditorBox> = props => {
  const {
    ethAddress,
    avatar,
    postLabel,
    placeholderLabel,
    onPublish,
    getMentions,
    getTags,
    mentions,
    tags,
    uploadRequest,
  } = props;

  const [showEditor, setShowEditor] = React.useState(false);
  const [editorState, setEditorState] = React.useState(defaultValue);
  const wrapperRef: React.RefObject<any> = React.useRef();

  const handleClickAway = () => {
    if (showEditor && isEqual(editorState, defaultValue)) {
      setShowEditor(false);
    }
  };
  const handlePublish = (data: any) => {
    onPublish(data);
    setShowEditor(false);
  };

  useSimpleClickAway(wrapperRef, handleClickAway);

  const handleToggleEditor = (ev: any) => {
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
            avatar={avatar}
            ethAddress={ethAddress}
            postLabel={postLabel}
            placeholderLabel={placeholderLabel}
            onPublish={handlePublish}
            getMentions={getMentions}
            getTags={getTags}
            mentions={mentions}
            tags={tags}
            uploadRequest={uploadRequest}
            withMeter={true}
            editorState={editorState}
            setEditorState={setEditorState}
          />
        </Box>
      )}
    </Box>
  );
};

export default CommentEditor;
