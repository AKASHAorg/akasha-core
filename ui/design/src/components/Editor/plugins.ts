import { Editor } from 'slate';

const withImages = (editor: Editor) => {
  const { exec, isVoid } = editor;

  editor.isVoid = (element: any) => {
    return element.type === 'image' ? true : isVoid(element);
  };

  editor.exec = (command: any) => {
    switch (command.type) {
      // case 'insert_data': {
      //   const { data } = command
      //   const text = data.getData('text/plain')
      //   const { files } = data

      //   if (files && files.length > 0) {
      //     for (const file of files) {
      //       const reader = new FileReader()
      //       const [mime] = file.type.split('/')

      //       if (mime === 'image') {
      //         reader.addEventListener('load', () => {
      //           const url = reader.result
      //           editor.exec({ type: 'insert_image', url })
      //         })

      //         reader.readAsDataURL(file)
      //       }
      //     }
      //   } else if (isImageUrl(text)) {
      //     editor.exec({ type: 'insert_image', url: text })
      //   } else {
      //     exec(command)
      //   }

      //   break
      // }

      case 'insert_image': {
        const { url } = command;
        const text = { text: '', marks: [] };
        const image = { type: 'image', url, children: [text] };
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

const withCustom = (editor: any) => {
  const { exec } = editor;

  editor.exec = (command: any) => {
    // Define a command to toggle the bold mark formatting.
    if (command.type === 'toggle_bold_mark') {
      const isActive = CustomEditor.isBoldMarkActive(editor);
      // Delegate to the existing `add_mark` and `remove_mark` commands, so that
      // other plugins can override them if they need to still.
      editor.exec({
        type: isActive ? 'remove_mark' : 'add_mark',
        mark: { type: 'bold' },
      });
    }

    // Define a command to toggle the code block formatting.
    else if (command.type === 'toggle_code_block') {
      const isActive = CustomEditor.isCodeBlockActive(editor);
      // There is no `set_nodes` command, so we can transform the editor
      // directly using the helper instead.
      Editor.setNodes(editor, { type: isActive ? null : 'code' }, { match: 'block' });
    }

    // Otherwise, fall back to the built-in `exec` logic for everything else.
    else {
      exec(command);
    }
  };

  return editor;
};

// Define our own custom set of helpers for common queries.
const CustomEditor = {
  isBoldMarkActive(editor: Editor) {
    const [mark] = Editor.marks(editor, {
      match: { type: 'bold' },
      mode: 'universal',
    });

    return !!mark;
  },

  isCodeBlockActive(editor: Editor) {
    const [node] = Editor.nodes(editor, {
      match: { type: 'code' },
      mode: 'highest',
    });

    return !!node;
  },
};

const withMarks = (editor: Editor) => {
  const { exec } = editor;

  editor.exec = (command: any) => {
    switch (command.type) {
      case 'toggle_mark': {
        const { mark } = command;
        const isActive = isMarkActive(editor, mark.type);
        const cmd = isActive ? 'remove_mark' : 'add_mark';
        editor.exec({ type: cmd, mark });
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

const isMarkActive = (editor: any, type: any) => {
  const [mark] = Editor.marks(editor, { match: { type }, mode: 'universal' });
  return !!mark;
};

export { withCustom, withMarks, withImages };
