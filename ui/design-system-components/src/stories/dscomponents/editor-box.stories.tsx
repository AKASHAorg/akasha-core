import type { Meta, StoryObj } from '@storybook/react';
import EditorBox, { EditorBoxProps } from '../../components/Editor';

const meta: Meta<EditorBoxProps> = {
  title: 'DSComponents/Editor/EditorBox',
  component: EditorBox,
  tags: ['autodocs'],
  argTypes: {
    profileId: { control: 'text' },
    actionLabel: { control: 'text' },
    placeholderLabel: { control: 'text' },
    onPublish: { action: 'published' },
    onClear: { action: 'editor cleared' },
    encodingFunction: { action: 'encoded' },
    onCancelClick: { action: 'action canceled' },
    setEditorState: { action: 'editor state set' },
  },
};

type Story = StoryObj<EditorBoxProps>;

export const Default: Story = {
  args: {
    profileId: 'some profile id',
    actionLabel: 'Publish',
    placeholderLabel: 'Share your thought',
    encodingFunction: () => '',
    setEditorState: () => ({}),
    onPublish: () => ({}),
    getMentions: () => ({}),
    getTags: () => ({}),
    transformSource: () => ({
      src: 'https://placebeard.it/360x360',
      width: 360,
      height: 360,
    }),
  },
};

export default meta;
