import React from 'react';
import { Box, Grommet } from 'grommet';

import TransparencyLogDetailCard, { ITransparencyLogDetailCardProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Cards/TransparencyLogDetailCard',
  component: TransparencyLogDetailCard,
  argType: {
    title: { control: 'text' },
    content: { control: 'text' },
    isDelisted: { control: 'boolean' },
    moderator: { control: 'text' },
    moderatedTimestamp: { control: 'text' },
    moderatorAvatarUrl: { control: 'text' },
    moderatorEthAddress: { control: 'text' },
    reportedTimesLabel: { control: 'text' },
    viewItemLabel: { control: 'text' },
    reasonsLabel: { control: 'text' },
    reasons: [{ control: 'text' }],
    explanationLabel: { control: 'text' },
    contactModeratorsLabel: { control: 'text' },
    onClickViewItem: { action: 'avatar clicked' },
    onClickAvatar: { action: 'avatar clicked' },
    onClickContactModerators: { action: 'moderators contacted' },
  },
};

const Template = (args: ITransparencyLogDetailCardProps) => (
  <Grommet theme={lightTheme}>
    <Box width="57.5%" pad="none" align="center">
      <TransparencyLogDetailCard {...args} />
    </Box>
  </Grommet>
);

const ethAddress = '0x003410490050000320006570034567114572000';

const reasons = ['Abusive or harmful to others', 'Violence'];

export const BaseTransparencyLogDetailCard = Template.bind({});

BaseTransparencyLogDetailCard.args = {
  locale: 'en',
  title: 'Post delisted by',
  content:
    'This post violates our Code of Conduct by being offensive and harmful to others. This person is directly threatening a group of people.',
  isDelisted: true,
  moderator: 'John Doe',
  moderatedTimestamp: '2021-06-14T16:48:00.000Z',
  moderatorAvatarUrl: 'https://placebeard.it/360x360',
  moderatorEthAddress: ethAddress,
  reportedTimesLabel: `Reported ${4} times`,
  viewItemLabel: 'View post',
  reasonsLabel: `${reasons.length > 1 ? 'reasons' : 'reason'}`,
  reasons: reasons,
  explanationLabel: 'explanation',
  contactModeratorsLabel: 'Contact the moderators',
};
