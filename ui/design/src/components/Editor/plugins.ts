import { Editor, Node, Path, Range, Transforms } from 'slate';

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
  const { isInline, isVoid, insertText } = editor;

  editor.insertText = (text: string) => {
    const { selection } = editor;
    const [parentNode]: any = selection ? Editor.parent(editor, selection) : [undefined];

    if (parentNode?.type === 'tag') {
      Transforms.insertText(editor, text);
    } else {
      insertText(text);
    }
  };

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
    if (text && isUrl(text.trim())) {
      if (getLinkPreview && typeof getLinkPreview === 'function') {
        CustomEditor.insertLink(editor, { url: text.trim() });
        await getLinkPreview(text);
      } else {
        CustomEditor.insertLink(editor, { url: text.trim() });
      }
    } else {
      insertText(text);
    }
  };

  editor.insertData = async data => {
    const text = data.getData('text/plain');

    if (text && isUrl(text.trim())) {
      if (getLinkPreview && typeof getLinkPreview === 'function') {
        CustomEditor.insertLink(editor, { url: text.trim() });
        await getLinkPreview(text);
      } else {
        CustomEditor.insertLink(editor, { url: text.trim() });
      }
    } else {
      insertData(data);
    }
  };

  return editor;
};

const withCorrectVoidBehavior = editor => {
  const { deleteBackward, insertBreak } = editor;

  // if current selection is void node, insert a default node below
  editor.insertBreak = () => {
    if (!editor.selection || !Range.isCollapsed(editor.selection)) {
      return insertBreak();
    }

    const selectedNodePath = Path.parent(editor.selection.anchor.path);
    const selectedNode = Node.get(editor, selectedNodePath);
    if (Editor.isVoid(editor, selectedNode)) {
      Editor.insertNode(editor, {
        type: 'paragraph',
        children: [{ text: '' }],
      });
      return;
    }

    insertBreak();
  };

  // if prev node is a void node, remove the current node and select the void node
  editor.deleteBackward = unit => {
    if (
      !editor.selection ||
      !Range.isCollapsed(editor.selection) ||
      editor.selection.anchor.offset !== 0
    ) {
      return deleteBackward(unit);
    }

    const parentPath = Path.parent(editor.selection.anchor.path);
    const parentNode = Node.get(editor, parentPath);
    const parentIsEmpty = Node.string(parentNode).length === 0;

    if (parentIsEmpty && Path.hasPrevious(parentPath)) {
      const prevNodePath = Path.previous(parentPath);
      const prevNode = Node.get(editor, prevNodePath);
      if (Editor.isVoid(editor, prevNode)) {
        return Transforms.removeNodes(editor);
      }
    }

    deleteBackward(unit);
  };

  return editor;
};

export { withImages, withMentions, withTags, withLinks, withCorrectVoidBehavior };
