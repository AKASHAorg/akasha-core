import * as React from 'react';
import { IEditorBox } from '../../Editor/editor-box';
declare const CommentEditor: React.FC<Omit<IEditorBox, 'editorState' | 'setEditorState'>>;
export default CommentEditor;
