import * as React from 'react';
import { useSlate } from 'slate-react';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

import { CustomEditor, TEXT_ALIGN_TYPES } from './helpers';

export type ToolbarButtonProps = {
  format: string;
  icon: JSX.Element;
  style?: string;
};

export const BlockButton: React.FC<ToolbarButtonProps> = ({ format, icon, style }) => {
  const editor = useSlate();
  const active = CustomEditor.isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type',
  );
  return (
    <button
      onClick={event => {
        event.preventDefault();
        CustomEditor.toggleBlock(editor, format);
      }}
    >
      <Stack
        align="center"
        justify="center"
        customStyle={`relative w-8 h-8 ${style}`}
        background={
          active ? { light: 'secondaryLight/30', dark: 'grey4' } : { light: 'grey8', dark: 'grey3' }
        }
      >
        <Icon size="lg" icon={icon} customStyle="absolute" solid accentColor />
      </Stack>
    </button>
  );
};

export const MarkButton: React.FC<ToolbarButtonProps> = ({ format, icon, style }) => {
  const editor = useSlate();
  const active = CustomEditor.isMarkActive(editor, format);
  return (
    <button
      onClick={event => {
        event.preventDefault();
        CustomEditor.toggleMark(editor, format);
      }}
    >
      <Stack
        align="center"
        justify="center"
        customStyle={`relative w-8 h-8 ${style}`}
        background={
          active ? { light: 'secondaryLight/30', dark: 'grey4' } : { light: 'grey8', dark: 'grey3' }
        }
      >
        <Icon size="lg" icon={icon} customStyle="absolute" solid accentColor />
      </Stack>
    </button>
  );
};
