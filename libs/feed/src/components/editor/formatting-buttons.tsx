import * as React from 'react';
import { useSlate } from 'slate-react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';

import { CustomEditor, TEXT_ALIGN_TYPES } from './helpers';
import { cn } from '@akashaorg/ui/lib/library/utils';

export type ToolbarButtonProps = {
  format: string;
  icon: JSX.Element;
  style?: string;
  callback?: () => void;
};

export const BlockButton: React.FC<ToolbarButtonProps> = ({ format, icon, style, callback }) => {
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
        callback();
      }}
    >
      <Stack
        alignItems="center"
        justifyContent="center"
        className={cn(
          `relative w-8 h-8 bg-inherit`,
          active ? 'bg-secondaryLight/30 dark:bg-grey4' : 'bg-grey8 dark:bg-grey3',
          style,
        )}
      >
        {icon}
      </Stack>
    </button>
  );
};

export const MarkButton: React.FC<ToolbarButtonProps> = ({ format, icon, style, callback }) => {
  const editor = useSlate();
  const active = CustomEditor.isMarkActive(editor, format);
  return (
    <button
      onClick={event => {
        event.preventDefault();
        CustomEditor.toggleMark(editor, format);
        callback();
      }}
    >
      <Stack
        alignItems="center"
        justifyContent="center"
        className={cn(
          `relative w-8 h-8 bg-inherit`,
          active ? 'bg-secondaryLight/30 dark:bg-grey4' : 'bg-grey8 dark:bg-grey3',
          style,
        )}
      >
        {icon}
      </Stack>
    </button>
  );
};
