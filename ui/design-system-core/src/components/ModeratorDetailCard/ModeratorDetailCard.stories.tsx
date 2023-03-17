import React from 'react';

import ModeratorDetailCard, { IModeratorDetailCardProps } from '.';

export default {
  title: 'Moderation/ModeratorDetailCard',
  component: ModeratorDetailCard,
};

const Template = (args: IModeratorDetailCardProps) => (
  <div style={{ width: '40%' }}>
    <ModeratorDetailCard {...args} />
  </div>
);

export const BaseModeratorDetailCard = Template.bind({});

BaseModeratorDetailCard.args = {
  moderator: {
    _id: 'skfljsbfsjkh02',
    _mod: new Date('Oct 01 2020'),
    creationDate: new Date('Oct 01 2020'),
    active: true,
    admin: true,
    coverImage: '',
    pubKey: 'bbaryslkgsjlglw',
    ethAddress: '0xs2486ogkjsf',

    name: 'April Curtis',
    userName: 'aprilcurtis',
    avatar: {
      url: '',
      fallbackUrl: '',
    },
    status: 'active',
    social: {
      discord: 'moderator',
    },
  },
  hasBorderBottom: false,
  tenureInfoLabel: 'Moderator since',
};
