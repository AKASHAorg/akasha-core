import React from 'react';

import EditorBox, { IEditorBox } from '.';

export default {
  title: 'Cards/EntryBox',
  component: EditorBox,
  argTypes: {
    avatar: { control: 'text' },
    showAvatar: { control: 'boolean' },
    showDraft: { control: 'boolean' },
    ethAddress: { control: 'text' },
    postLabel: { control: 'text' },
    placeholderLabel: { control: 'text' },
    emojiPlaceholderLabel: { control: 'text' },
    uploadFailedLabe: { control: 'text' },
    uploadingImageLabel: { control: 'text' },
    disablePublishLabel: { control: 'text' },
    setEditorState: { control: 'func' },
  },
};

const Template = (args: IEditorBox) => <EditorBox {...args} />;

export const BaseEditorBox = Template.bind({});

BaseEditorBox.args = {
  ethAddress: '0x003410490050000320006570034567114572021',
  postLabel: 'Publish',
  placeholderLabel: 'Share your thought',
  setEditorState: () => null,
};
