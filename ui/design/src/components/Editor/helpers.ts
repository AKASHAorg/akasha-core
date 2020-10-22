import { Editor, Text, Transforms } from 'slate';
import ReactDOM from 'react-dom';

const CustomEditor = {
  isBlockActive(editor: Editor, format: string) {
    const [match] = Editor.nodes(editor, {
      match: n => n.type === format,
    });

    return !!match;
  },

  isFormatActive(editor: Editor, format: string) {
    const [match] = Editor.nodes(editor, {
      match: n => n[format] === true,
      mode: 'all',
    });
    return !!match;
  },

  toggleBlock(editor: Editor, format: string) {
    const isActive = CustomEditor.isBlockActive(editor, format);
    Transforms.setNodes(
      editor,
      { type: isActive ? null : format },
      { match: n => Editor.isBlock(editor, n) },
    );
  },

  toggleFormat(editor: Editor, format: string) {
    const isActive = this.isFormatActive(editor, format);
    Transforms.setNodes(
      editor,
      { [format]: isActive ? null : true },
      { match: Text.isText, split: true },
    );
  },

  insertImage(editor: Editor, url: string) {
    const text = { text: '' };
    const image = { url, type: 'image', children: [text] };
    Transforms.insertNodes(editor, image);
  },

  insertText(editor: Editor, text: string) {
    Transforms.insertNodes(editor, { text, type: 'text' });
  },

  insertMention(editor: Editor, value: string) {
    const mention = { value, type: 'mention', children: [{ text: '' }] };
    Transforms.insertNodes(editor, mention);
    Transforms.move(editor);
  },

  insertTag(editor: Editor, value: string) {
    const tag = { value, type: 'tag', children: [{ text: '' }] };
    Transforms.insertNodes(editor, tag);
    Transforms.move(editor);
  },
};

export const Portal = ({ children }: any) => {
  return ReactDOM.createPortal(children, document.body);
};

export { CustomEditor };
