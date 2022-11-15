import React from 'react';
import { Grommet } from 'grommet';

import ModeratorDetailCard, { IModeratorDetailCardProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

const moderator = {
  _id: 'bbaareie6w5f2l6b4kpysopls6n4nuejbcyjrzwf7wcjpi3hg',
  _mod: new Date(),
  creationDate: new Date(),
  admin: true,
  active: true,
  coverImage: '',
  pubKey: 'bbaareie6w5f2l6b4kpysopls6n4nuejbcyjrzwf7wcjpi3hg',
  ethAddress: '',
  name: 'Isabel Milkovic',
  userName: 'isabelmilkovic',
  avatar: {
    url: '',
    fallbackUrl: '',
  },
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
