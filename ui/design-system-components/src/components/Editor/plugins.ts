import { CustomElement } from '@akashaorg/typings/lib/ui';
import { Editor, Node, Path, Range, Transforms } from 'slate';

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

const withLinks = (editor: Editor) => {
  const { isInline, isVoid } = editor;

  editor.isInline = element => {
    return element.type === 'link' ? true : isInline(element);
  };

  editor.isVoid = element => {
    return element.type === 'link' ? true : isVoid(element);
  };

  return editor;
};

const withCorrectVoidBehavior = editor => {
  const { deleteBackward, insertBreak, selection } = editor;

  // if current selection is void node, insert a default node below
  editor.insertBreak = () => {
    if (!selection || !Range.isCollapsed(selection)) {
      return insertBreak();
    }

    const selectedNodePath = Path.parent(selection.anchor.path);
    const selectedNode = Node.get(editor, selectedNodePath);
    if (Editor.isVoid(editor, selectedNode as CustomElement)) {
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
    const { selection } = editor;
    if (!selection || !Range.isCollapsed(selection) || selection.anchor.offset !== 0) {
      return deleteBackward(unit);
    }

    const parentPath = Path.parent(selection.anchor.path);
    const parentNode = Node.get(editor, parentPath);
    const parentIsEmpty = Node.string(parentNode).length === 0;

    if (parentIsEmpty && Path.hasPrevious(parentPath)) {
      const prevNodePath = Path.previous(parentPath);
      const prevNode = Node.get(editor, prevNodePath);
      if (Editor.isVoid(editor, prevNode as CustomElement)) {
        return Transforms.removeNodes(editor);
      }
    }

    deleteBackward(unit);
  };

  return editor;
};

export { withMentions, withTags, withLinks, withCorrectVoidBehavior };
