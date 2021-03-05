import * as React from 'react';
export interface IEditorPlaceholder {
  avatar?: string;
  ethAddress: string | null;
  placeholderLabel?: string;
  onClick?: any;
  style?: React.CSSProperties;
}
declare const EditorPlaceholder: React.FC<IEditorPlaceholder>;
export { EditorPlaceholder };
