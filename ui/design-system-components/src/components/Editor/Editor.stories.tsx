import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import EditorBox, { EditorBoxProps } from '.';

const meta: Meta<EditorBoxProps> = {
  title: 'Editor/EditorBox',
  component: EditorBox,
};

export default meta;
type Story = StoryObj<EditorBoxProps>;

export const BaseEditorBox: Story = {
  render: () => (
    <EditorBox
      profileId="some profile id"
      postLabel="Publish"
      placeholderLabel="Share your thought"
      setEditorState={() => ({})}
      onPublish={() => ({})}
      getMentions={() => ({})}
      getTags={() => ({})}
    />
  ),
};
