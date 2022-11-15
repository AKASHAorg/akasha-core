import React from 'react';
import { Box, Grommet } from 'grommet';

import EditorBox, { IEditorBox } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

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

const Template = (args: IEditorBox) => (
  <Grommet theme={lightTheme}>
    <Box align="center" pad={{ top: '40px' }} width="582px">
      <EditorBox {...args} />
    </Box>
  </Grommet>
);

export const BaseEditorBox = Template.bind({});

BaseEditorBox.args = {
  ethAddress: '0x003410490050000320006570034567114572021',
  postLabel: 'Publish',
  placeholderLabel: 'Share your thought',
  setEditorState: () => null,
};
