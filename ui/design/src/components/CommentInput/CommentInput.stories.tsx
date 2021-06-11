import React from 'react';
import { Box, Grommet } from 'grommet';

import CommentInput, { ICommentInput } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Input/CommentInput',
  component: CommentInput,
  argTypes: {
    avatarImg: { control: 'text' },
    ethAddress: { control: 'text' },
    placeholderLabel: { control: 'text' },
    publishLabel: { control: 'text' },
    onPublish: { action: 'published' },
  },
};

const Template = (args: ICommentInput) => (
  <Grommet theme={lightTheme}>
    <Box justify="center" align="center">
      <Box width="581px" pad={{ top: 'large' }}>
        <CommentInput {...args} />
      </Box>
    </Box>
  </Grommet>
);

export const BaseCommentInput = Template.bind({});

BaseCommentInput.args = {
  avatarImg: 'https://placebeard.it/640/480',
  ethAddress: '0x003410490050000320006570047391024572000',
  placeholderLabel: 'Write a comment',
  publishLabel: 'Publish',
};
