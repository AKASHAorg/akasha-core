import { Editor, Text, Transforms, Element, Node, Path } from 'slate';
import { ReactEditor } from 'slate-react';
import ReactDOM from 'react-dom';
import {
  CustomText,
  ImageElement,
  LinkElement,
  MentionElement,
  TagElement,
} from '@akashaproject/ui-awf-typings/lib/editor';

const CustomEditor = {
  isBlockActive(editor: Editor, format: string) {
    const [match] = Editor.nodes(editor, {
      match: n => Element.isElement(n) && n.type === format,
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

  toggleFormat(editor: Editor, format: string) {
    const isActive = this.isFormatActive(editor, format);
    Transforms.setNodes(
      editor,
      { [format]: isActive ? null : true },
      { match: Text.isText, split: true },
    );
  },

  insertImage(
    editor: Editor,
    url: string,
    size: {
      width: string;
      height: string;
      naturalWidth: string;
      naturalHeight: string;
    },
  ) {
    const text = { text: '' };
    const image: ImageElement = { url, size, type: 'image', children: [text] };
    // move selection to the end before inserting to make sure image is last element
    Transforms.select(editor, Editor.end(editor, []));
    Transforms.insertNodes(editor, image);
    // give slate time to render the image element
    requestAnimationFrame(() => moveSelectionBeforeImage(editor));
  },

  insertText(editor: Editor, text: string) {
    ReactEditor.focus(editor);
    // if the last element is an image and the user doesn't have
    // an active selection move the selection before the image
    if (!editor.selection) {
      moveSelectionBeforeImage(editor);
    }
    const textElem: CustomText = { text };
    Transforms.insertNodes(editor, textElem);
  },

  insertMention(
    editor: Editor,
    mentionData: {
      name?: string;
      userName?: string;
      pubKey: string;
      avatar?: string;
      ethAddress: string;
    },
  ) {
    const baseMention: { type: 'mention'; children: [{ text: '' }] } = {
      type: 'mention',
      children: [{ text: '' }],
    };
    const mention: MentionElement = Object.assign(baseMention, mentionData);
    Transforms.insertNodes(editor, mention);
    ReactEditor.focus(editor);
    Transforms.move(editor);
  },

  insertTag(editor: Editor, tagData: { name: string; totalPosts: number }) {
    const baseTag: { type: 'tag'; children: [{ text: '' }] } = {
      type: 'tag',
      children: [{ text: '' }],
    };
    const tag: TagElement = Object.assign(baseTag, tagData);
    Transforms.insertNodes(editor, tag);
    ReactEditor.focus(editor);
    Transforms.move(editor);
  },

  insertLink(editor: Editor, linkData: { url: string }) {
    const baseLink: { type: 'link'; children: [{ text: '' }] } = {
      type: 'link',
      children: [{ text: '' }],
    };
    const link: LinkElement = Object.assign(baseLink, linkData);
    Transforms.insertNodes(editor, link);
    ReactEditor.focus(editor);
    Transforms.move(editor);
  },

  deleteImage(editor: Editor, element: Element) {
    const path = ReactEditor.findPath(editor, element);
    Transforms.removeNodes(editor, {
      voids: true,
      at: path,
    });
    ReactEditor.focus(editor);
    Transforms.move(editor);
  },
};

export const moveSelectionBeforeImage = (editor: Editor) => {
  const [match] = Editor.nodes(editor, {
    match: n => Element.isElement(n) && n.type === 'image',
    mode: 'all',
  });
  if (match?.length) {
    const imageNode = match[0];
    const imagePath = ReactEditor.findPath(editor, imageNode);
    // move the selection before the image
    if (Node.isNode(imageNode)) {
      ReactEditor.focus(editor);
      Transforms.select(editor, Editor.end(editor, Path.previous(imagePath)));
    }
  }
};

export const Portal = ({ children }: any) => {
  return ReactDOM.createPortal(children, document.body);
};

export { CustomEditor };
