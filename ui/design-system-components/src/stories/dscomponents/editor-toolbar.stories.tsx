import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import EditorToolbar, { EditorToolbarProps } from '../../components/EditorToolbar';

const meta: Meta<EditorToolbarProps> = {
  title: 'DSComponents/Editor/EditorToolbar',
  component: EditorToolbar,
};

export default meta;
type Story = StoryObj<EditorToolbarProps>;

export const BaseEditorToolbar: Story = {
  render: () => (
    <EditorToolbar
      onBoldClick={() => ({})}
      onItalicClick={() => ({})}
      onStrikeThroughClick={() => ({})}
      onUnderlineClick={() => ({})}
    />
  ),
};
