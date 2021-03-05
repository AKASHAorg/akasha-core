import * as React from 'react';
import { IEditorBox } from '../../Editor/editor-box';
export interface IEditorCard extends IEditorBox {
  className?: string;
  newPostLabel?: string;
  style?: React.CSSProperties;
  handleNavigateBack: () => void;
}
declare const EditorCard: React.FC<IEditorCard>;
export default EditorCard;
