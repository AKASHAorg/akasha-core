import * as React from 'react';
export interface IEditorMeter {
  maxValue?: number;
  counter: number;
}
declare const EditorMeter: React.FC<IEditorMeter>;
export { EditorMeter };
