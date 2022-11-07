import React from 'react';
import { Grommet } from 'grommet';

import ModeratorDetailCard, { IModeratorDetailCardProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

const moderator = {
  name: 'Isabel Milkovic',
  username: 'isabelmilkovic',
  avatar: {
    url: '',
    fallbackUrl: '',
  },
  moderatorStartDate: '2020-10-01T00:00:00.000Z',
  status: 'active',
  social: { discord: 'isabelmilkovic', email: 'isabel.milkovic@akasha.world' },
};

export default {
  title: 'Cards/ModeratorDetailCard',
  component: ModeratorDetailCard,
  argTypes: {
    tenureInfoLabel: { control: 'text' },
  },
};

const Template = (args: IModeratorDetailCardProps) => (
  <Grommet theme={lightTheme}>
    <ModeratorDetailCard {...args} />
  </Grommet>
);

export const BaseModeratorDetailCard = Template.bind({});
BaseModeratorDetailCard.args = {
  moderator: moderator,
  hasBorderBottom: true,
  tenureInfoLabel: moderator.status === 'active' ? 'Moderator since' : 'Moderator until',
};
