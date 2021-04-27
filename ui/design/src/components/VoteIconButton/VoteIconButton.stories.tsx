import React from 'react';
import { Grommet } from 'grommet';

import VoteIconButton from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Buttons/VoteIconButton',
  component: VoteIconButton,
  argTypes: {
    label: { control: 'text' },
    voteType: {
      control: {
        type: 'radio',
        options: ['upvote', 'downvote'],
      },
    },
    voted: { control: 'boolean' },
  },
};

const Template = (args: any) => (
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
