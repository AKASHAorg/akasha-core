import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import {
  BoldAlt,
  Italic,
  Underline,
  ListNumbered,
  ListBulleted,
  AlignCenter,
  AlignLeft,
  AlignRight,
} from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';

import { useSlate } from 'slate-react';
import { Editor, Transforms, Element as SlateElement } from 'slate';

const LIST_TYPES = ['numbered-list', 'bulleted-list'];
const TEXT_ALIGN_TYPES = ['left', 'center', 'right'];

const isBlockActive = (editor, format, blockType = 'type') => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n[blockType] === format,
    }),
  );

  return !!match;
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type',
  );
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });
  let newProperties: Partial<SlateElement>;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    const inactiveFormat = isList ? 'list-item' : format;
    newProperties = {
      type: isActive ? 'paragraph' : inactiveFormat,
    };
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const EditorToolbar: React.FC = () => {
  const BlockButton = ({ format, icon }) => {
    const editor = useSlate();
    const active = isBlockActive(
      editor,
      format,
      TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type',
    );
    return (
      <button
        onClick={event => {
          event.preventDefault();
          toggleBlock(editor, format);
        }}
      >
        <Stack
          align="center"
          justify="center"
          customStyle="relative w-6 h-6 rounded-l-sm"
          background={
            active
              ? { light: 'secondaryLight/30', dark: 'grey7' }
              : { light: 'grey8', dark: 'grey5' }
          }
        >
          <Icon icon={icon} customStyle="absolute" />
        </Stack>
      </button>
    );
  };

  const MarkButton = ({ format, icon }) => {
    const editor = useSlate();
    const active = isMarkActive(editor, format);
    return (
      <button
        onClick={event => {
          event.preventDefault();
          toggleMark(editor, format);
        }}
      >
        <Stack
          align="center"
          justify="center"
          customStyle="relative w-6 h-6 rounded-l-sm"
          background={
            active
              ? { light: 'secondaryLight/30', dark: 'grey7' }
              : { light: 'grey8', dark: 'grey5' }
          }
        >
          <Icon icon={icon} customStyle="absolute" />
        </Stack>
      </button>
    );
  };

  return (
    <Stack direction="row">
      <MarkButton format="bold" icon={<BoldAlt />} />
      <MarkButton format="italic" icon={<Italic />} />
      <MarkButton format="underline" icon={<Underline />} />
      <BlockButton format="left" icon={<AlignLeft />} />
      <BlockButton format="center" icon={<AlignCenter />} />
      <BlockButton format="right" icon={<AlignRight />} />
      <BlockButton format="numbered-list" icon={<ListNumbered />} />
      <BlockButton format="bulleted-list" icon={<ListBulleted />} />
    </Stack>
  );
};

export default EditorToolbar;
