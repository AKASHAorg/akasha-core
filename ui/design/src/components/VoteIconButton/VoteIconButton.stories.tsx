import React from 'react';
import { Grommet } from 'grommet';

import VoteIconButton, { IVoteIconProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Buttons/VoteIconButton',
  component: VoteIconButton,
  argTypes: {
    voteType: {
      control: {
        type: 'radio',
        options: ['upvote', 'downvote'],
      },
    },
    voteCount: { control: 'number' },
    voted: { control: 'boolean' },
    onClick: { action: 'button clicked' },
  },
};

const Template = (args: IVoteIconProps) => (
  <Grommet theme={lightTheme}>
    <VoteIconButton {...args} />
  </Grommet>
);

export const BaseVoteIcon = Template.bind({});
BaseVoteIcon.args = {
  voteType: 'upvote',
  voteCount: 147,
};

export const VoteIconVoted = Template.bind({});
VoteIconVoted.args = {
  voteType: 'upvote',
  voteCount: 148,
  voted: true,
};
