import type { Meta, StoryObj } from '@storybook/react';
import EditorBox, { EditorBoxProps } from '../../components/Editor';

const meta: Meta<EditorBoxProps> = {
  title: 'DSComponents/Editor/EditorBox',
  component: EditorBox,
};

type Story = StoryObj<EditorBoxProps>;

export const Default: Story = {
  args: {
    avatar: { default: { src: 'https://placebeard.it/360x360', height: 360, width: 360 } },
    profileId: 'some profile id',
    actionLabel: 'Publish',
    placeholderLabel: 'Share your thought',
    disableActionLabel: 'disable action',
    maxEncodedLengthErrLabel: 'max encoded',
    noMentionsLabel: 'No mentions',
    disablePublish: false,
    minHeight: '2rem',
    withMeter: true,
    withToolbar: true,
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
