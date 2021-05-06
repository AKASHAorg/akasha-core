import * as React from 'react';
import { IEditorBox } from '../Editor/editor-box';
import { Box } from 'grommet';
import { EditorPlaceholder } from './editor-placeholder';
import { EditorBox, editorDefaultValue } from '../Editor/index';
import { useOnClickAway } from '../../utils/clickAway';
import isEqual from 'lodash.isequal';

const CommentEditor: React.FC<Omit<IEditorBox, 'editorState' | 'setEditorState'>> = props => {
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
  const [editorState, setEditorState] = React.useState(editorDefaultValue);
  const wrapperRef: React.RefObject<HTMLDivElement> = React.useRef(null);
  const editorRef: React.RefObject<any> = React.useRef(null);

  const handleClickAway = () => {
    if (
      showEditor &&
      isEqual(editorState, editorDefaultValue) &&
      !editorRef.current?.getPopoversState()
    ) {
      setShowEditor(false);
    }
  };
  const handlePublish = (data: any) => {
    onPublish(data);
    setShowEditor(false);
  };

  useOnClickAway(wrapperRef, handleClickAway);

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
            ref={editorRef}
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

export { CommentEditor };
