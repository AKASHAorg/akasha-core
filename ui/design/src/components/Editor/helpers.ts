import { Editor, Text, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
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

  insertImage(
    editor: ReactEditor,
    url: string,
    size: {
      width: string;
      height: string;
      naturalWidth: string;
      naturalHeight: string;
    },
  ) {
    const text = { text: '' };
    const image = { url, size, type: 'image', children: [text] };
    Transforms.insertNodes(editor, image);
    ReactEditor.focus(editor);
    Transforms.select(editor, Editor.end(editor, []));
  },

  insertText(editor: ReactEditor, text: string) {
    ReactEditor.focus(editor);
    Transforms.select(editor, Editor.end(editor, []));
    Transforms.insertNodes(editor, { text, type: 'text' });
  },

  insertMention(
    editor: Editor,
    mentionData: {
      name: string;
      userName: string;
      pubKey: string;
      avatar: string;
      ethAddress: string;
    },
  ) {
    const mention = Object.assign({ type: 'mention', children: [{ text: '' }] }, mentionData);
    Transforms.insertNodes(editor, mention);
    Transforms.move(editor);
  },

  insertTag(editor: Editor, tagData: { name: string; totalPosts: number }) {
    const tag = Object.assign({ type: 'tag', children: [{ text: '' }] }, tagData);
    Transforms.insertNodes(editor, tag);
    Transforms.move(editor);
  },

  deleteImage(editor: Editor, element: any) {
    Transforms.removeNodes(editor, {
      voids: true,
      match: n => {
        return n === element;
      },
    });
    Transforms.select(editor, Editor.end(editor, []));
  },
};

export const Portal = ({ children }: any) => {
  return ReactDOM.createPortal(children, document.body);
};

export { CustomEditor };
