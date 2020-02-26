import { Editor } from 'slate';
import { CustomEditor } from './helpers';

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

const isImageUrl = (url: string) => {
  if (!url) return false;
  return true;
};

export { withImages };
