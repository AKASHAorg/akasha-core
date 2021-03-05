import * as React from 'react';
import { IEditorCard } from '../../Cards/editor-cards/editor-card';
export interface IEditorModal extends Omit<IEditorCard, 'editorState' | 'setEditorState'> {
  slotId: string;
  showModal: boolean;
  discardPostLabel?: string;
  discardPostInfoLabel?: string;
  keepEditingLabel?: string;
}
declare const EditorModal: React.FC<IEditorModal>;
export default EditorModal;
