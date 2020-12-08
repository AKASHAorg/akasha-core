import * as React from 'react';
import { IEditorBox } from '../../Editor/editor-box';
import { Box } from 'grommet';
import { EditorPlaceholder } from './editor-placeholder';
import { EditorBox } from '../../Editor/index';
import useSimpleClickAway from '../../../utils/simpleClickAway';

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
  const wrapperRef: React.RefObject<any> = React.useRef();

  const handleToggleEditor = () => {
    setShowEditor(!showEditor);
  };

  const handleClickAway = () => {
    if (showEditor) {
      setShowEditor(false);
    }
  };

  useSimpleClickAway(wrapperRef, handleClickAway);

  return (
    <Box>
      {!showEditor && (
        <EditorPlaceholder
          onClick={handleToggleEditor}
          ethAddress={ethAddress}
          avatar={avatar}
          placeholderLabel={placeholderLabel}
        />
      )}
      {showEditor && (
        <Box
          border={{ side: 'all', size: '1px', color: 'border' }}
          pad="xxsmall"
          round="xsmall"
          ref={wrapperRef}
        >
          <EditorBox
            avatar={avatar}
            ethAddress={ethAddress}
            postLabel={postLabel}
            placeholderLabel={placeholderLabel}
            onPublish={onPublish}
            getMentions={getMentions}
            getTags={getTags}
            mentions={mentions}
            tags={tags}
            uploadRequest={uploadRequest}
            withMeter={true}
          />
        </Box>
      )}
    </Box>
  );
};

export default CommentEditor;
