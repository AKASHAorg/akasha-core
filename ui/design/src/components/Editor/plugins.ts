import { EventHook } from 'slate-react';

interface MarkHotkeyOptions {
  type: string;
  key: string;
}

const MarkHotkey: (options: MarkHotkeyOptions) => any = options => {
  const { type, key } = options;

  const onKeyDown: EventHook<React.KeyboardEvent<Element>> = (event, editor, next) => {
    // If it doesn't match our `key`, let other plugins handle it.
    if (!event.ctrlKey || event.key !== key) {
      return next();
    }

    // Prevent the default characters from being inserted.
    event.preventDefault();

    // Toggle the mark `type`.
    editor.toggleMark(type);
  };

  // Return our "plugin" object, containing the `onKeyDown` handler.
  return {
    onKeyDown,
  };
};

const boldPlugin = MarkHotkey({
  type: 'bold',
  key: 'b',
});

const codePlugin = MarkHotkey({
  type: 'code',
  key: '`',
});

const italicPlugin = MarkHotkey({
  type: 'italic',
  key: 'i',
});

const underlinePlugin = MarkHotkey({
  type: 'underline',
  key: 'u',
});

export { boldPlugin, codePlugin, italicPlugin, underlinePlugin };
