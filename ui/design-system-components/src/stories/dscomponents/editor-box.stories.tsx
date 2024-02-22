import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import EditorBox, { EditorBoxProps } from '../../components/Editor';

const meta: Meta<EditorBoxProps> = {
  title: 'DSComponents/Editor/EditorBox',
  component: EditorBox,
};

export default meta;
type Story = StoryObj<EditorBoxProps>;

export const BaseEditorBox: Story = {
  render: () => (
    <EditorBox
      encodingFunction={() => ''}
      profileId="some profile id"
      actionLabel="Publish"
      placeholderLabel="Share your thought"
      setEditorState={() => ({})}
      onPublish={() => ({})}
      getMentions={() => ({})}
      getTags={() => ({})}
      transformSource={() => ({
        src: 'https://placebeard.it/360x360',
        width: 360,
        height: 360,
      })}
    />
  ),
};
