import React from 'react';
import ProfileSearchCard, { IProfileSearchCard } from '.';
import { profileData } from '@akashaorg/design-system-core/lib/utils/dummy-data';

export default {
  title: 'Cards/ProfileSearchCard',
  component: ProfileSearchCard,
};

const TemplateSearch = (args: IProfileSearchCard) => (
  <div>
    <ProfileSearchCard {...args} />
  </div>
);

export const BaseProfileSearchCard = TemplateSearch.bind({});

BaseProfileSearchCard.args = {
  profileAnchorLink: '/profile',
  profileData: profileData,
};
