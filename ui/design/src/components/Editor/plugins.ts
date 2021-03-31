import { Editor } from 'slate';
import { ReactEditor } from 'slate-react';

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

export { withImages, withMentions, withTags };
