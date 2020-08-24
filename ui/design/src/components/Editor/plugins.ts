import { Editor } from 'slate';
import { ReactEditor } from 'slate-react';
import { CustomEditor } from './helpers';
// import { isUrl } from '../../utils/is-url';

const withImages = (editor: Editor) => {
  const { isVoid } = editor;

  editor.isVoid = element => {
    return element.type === 'image' ? true : isVoid(element);
  };

  editor.insertData = (data: any) => {
    const text = data.getData('text/plain');

    if (isImageUrl(text)) {
      CustomEditor.insertImage(editor, text);
    }
  };

  return editor;
};

const withMentions = (editor: Editor & ReactEditor) => {
  const { isInline, isVoid } = editor;

  editor.isInline = element => {
    return element.type === 'mention' ? true : isInline(element);
  };

  editor.isVoid = element => {
    return element.type === 'mention' ? true : isVoid(element);
  };

  return editor;
};

const isImageUrl = (url: string) => {
  if (!url) return false;
  return true;
};

export { withImages, withMentions };
