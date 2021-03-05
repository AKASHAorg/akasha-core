import { Editor } from 'slate';
import { ReactEditor } from 'slate-react';
declare const withImages: (editor: Editor) => Editor;
declare const withMentions: (editor: Editor & ReactEditor) => Editor & ReactEditor;
declare const withTags: (editor: Editor & ReactEditor) => Editor & ReactEditor;
export { withImages, withMentions, withTags };
