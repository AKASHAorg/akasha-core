import { Editor } from 'slate';
import { ReactEditor } from 'slate-react';
import isUrl from 'is-url';
import { CustomEditor } from './helpers';

const withImages = (editor: Editor) => {
  const { isVoid } = editor;

  editor.isVoid = element => {
    return element.type === 'image' ? true : isVoid(element);
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

const withTags = (editor: Editor & ReactEditor) => {
  const { isInline, isVoid } = editor;

  editor.isInline = element => {
    return element.type === 'tag' ? true : isInline(element);
  };

  editor.isVoid = element => {
    return element.type === 'tag' ? true : isVoid(element);
  };

  return editor;
};

const withLinks = (editor: Editor & ReactEditor) => {
  const { insertData, insertText, isInline, isVoid } = editor;

  editor.isInline = element => {
    return element.type === 'link' ? true : isInline(element);
  };

  editor.isVoid = element => {
    return element.type === 'link' ? true : isVoid(element);
  };

  editor.insertText = text => {
    if (text && isUrl(text)) {
      CustomEditor.insertLink(editor, { url: text });
    } else {
      insertText(text);
    }
  };

  editor.insertData = data => {
    const text = data.getData('text/plain');

    if (text && isUrl(text)) {
      CustomEditor.insertLink(editor, { url: text });
    } else {
      insertData(data);
    }
  };

  return editor;
};

export { withImages, withMentions, withTags, withLinks };
