import * as React from 'react';
import { IEditorBox } from '../../Editor/editor-box';
import { Box } from 'grommet';
import { EditorPlaceholder } from './editor-placeholder';
import { EditorBox } from '../../Editor/index';
import useSimpleClickAway from '../../../utils/simpleClickAway';

export interface ICommentEditor extends IEditorBox {}

const CommentEditor: React.FC<ICommentEditor> = props => {
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

  const handleToggleEditor = () => {
    setShowEditor(!showEditor);
  };
  const wrapperRef: React.RefObject<any> = React.useRef();

  const handleClickAway = () => {
    if (showEditor) {
      setShowEditor(false);
    }
  };

  const [showEditor, setShowEditor] = React.useState(false);
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
