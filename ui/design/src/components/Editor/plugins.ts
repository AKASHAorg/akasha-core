import { Editor } from 'slate';

const withImages = (editor: Editor) => {
  const { exec, isVoid } = editor;

  editor.isVoid = element => {
    return element.type === 'image' ? true : isVoid(element);
  };

  editor.exec = command => {
    switch (command.type) {
      case 'insert_image': {
        const { url } = command;
        const text = { text: '', marks: [] };
        const image = { url, type: 'image', children: [text] };
        Editor.insertNodes(editor, image);
        break;
      }

      default: {
        exec(command);
        break;
      }
    }
  };

  return editor;
};

const withFormatting = (editor: Editor) => {
  const { exec } = editor;

  editor.exec = command => {
    switch (command.type) {
      case 'toggle_format': {
        const { format } = command;
        const isActive = isFormatActive(editor, format);
        Editor.setNodes(
          editor,
          { [format]: isActive ? null : true },
          { match: 'text', split: true },
        );
        break;
      }

      default: {
        exec(command);
        break;
      }
    }
  };

  return editor;
};

const isFormatActive = (editor: Editor, format: string) => {
  const [match] = Editor.nodes(editor, {
    match: { [format]: true },
    mode: 'all',
  });
  return !!match;
};

export { withFormatting, withImages };
