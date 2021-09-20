import { Editor } from 'slate';

import isUrl from 'is-url';
import { CustomEditor } from './helpers';

const withImages = (editor: Editor) => {
  const { isVoid } = editor;

  editor.isVoid = element => {
    return element.type === 'image' ? true : isVoid(element);
  };

  return editor;
};

const withMentions = (editor: Editor) => {
  const { isInline, isVoid } = editor;

  editor.isInline = element => {
    return element.type === 'mention' ? true : isInline(element);
  };

  editor.isVoid = element => {
    return element.type === 'mention' ? true : isVoid(element);
  };

  return editor;
};

const withTags = (editor: Editor) => {
  const { isInline, isVoid } = editor;

  editor.isInline = element => {
    return element.type === 'tag' ? true : isInline(element);
  };

  editor.isVoid = element => {
    return element.type === 'tag' ? true : isVoid(element);
  };

  return editor;
};

const withLinks = (editor: Editor, getLinkPreview?: (url: string) => any) => {
  const { insertData, insertText, isInline, isVoid } = editor;

  editor.isInline = element => {
    return element.type === 'link' ? true : isInline(element);
  };

  editor.isVoid = element => {
    return element.type === 'link' ? true : isVoid(element);
  };

  editor.insertText = async text => {
    if (text && isUrl(text)) {
      if (getLinkPreview && typeof getLinkPreview === 'function') {
        CustomEditor.insertLink(editor, { url: text });
      } else {
        CustomEditor.insertLink(editor, { url: text });
      }
    } else {
      insertText(text);
    }
  };

  editor.insertData = async data => {
    const text = data.getData('text/plain');

    if (text && isUrl(text)) {
      if (getLinkPreview && typeof getLinkPreview === 'function') {
        CustomEditor.insertLink(editor, { url: text });
      } else {
        CustomEditor.insertLink(editor, { url: text });
      }
    } else {
      insertData(data);
    }
  };

  return editor;
};

export { withImages, withMentions, withTags, withLinks };
