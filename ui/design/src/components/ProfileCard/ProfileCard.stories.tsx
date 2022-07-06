import React from 'react';
import { Box, Grommet } from 'grommet';

import ProfileCard, { IProfileCardProps } from '.';
import { ProfileSearchCard, IProfileSearchCard } from './profile-search-card';
import { ProfileMiniCard, IProfileMiniCard } from './profile-mini-card';
import { ProfileDelistedCard, IProfileDelistedCard } from './profile-delisted-card';

import lightTheme from '../../styles/themes/light/light-theme';
import {
  appData,
  profileData,
  profileProvidersData,
  postsLabel,
  cancelLabel,
  aboutMeLabel,
  followingLabel,
  followersLabel,
  saveChangesLabel,
  editProfileLabel,
  shareProfileLabel,
  changeCoverImageLabel,
  badgesLabel,
} from '../../utils/dummy-data';

export default {
  title: 'Cards/ProfileCard',
  component: ProfileCard,
  argType: {
    profileData: {
      type: 'radio',
      options: [appData, profileData],
    },
  },
};

const Template = (args: IProfileCardProps) => (
  <Grommet theme={lightTheme}>
    <Box align="center" width="50%" pad={{ top: '40px' }}>
      <ProfileCard {...args} />
    </Box>
  </Grommet>
);

const TemplateDelisted = (args: IProfileDelistedCard) => (
  <Grommet theme={lightTheme}>
    <Box align="center" width="50%" pad={{ top: '40px' }}>
      <ProfileDelistedCard {...args} />
    </Box>
  </Grommet>
);

const TemplateSearch = (args: IProfileSearchCard) => (
  <Grommet theme={lightTheme}>
    <Box align="center" width="50%" pad={{ top: '40px' }}>
      <ProfileSearchCard {...args} />
    </Box>
  </Grommet>
);

const TemplateMini = (args: IProfileMiniCard) => (
  <Grommet theme={lightTheme}>
    <Box align="center" width="30%" pad={{ top: '40px' }}>
      <ProfileMiniCard {...args} />
    </Box>
  </Grommet>
);

export const BaseProfileCard = Template.bind({});

BaseProfileCard.args = {
  profileData: profileData,
  descriptionLabel: aboutMeLabel,
  badgesLabel: badgesLabel,
  followingLabel: followingLabel,
  followersLabel: followersLabel,
  postsLabel: postsLabel,
  shareProfileLabel: shareProfileLabel,
  editProfileLabel: editProfileLabel,
  profileProvidersData: profileProvidersData,
  changeCoverImageLabel: changeCoverImageLabel,
  cancelLabel: cancelLabel,
  saveChangesLabel: saveChangesLabel,
};

export const BaseProfileDelistedCard = TemplateDelisted.bind({});

BaseProfileDelistedCard.args = {
  name: '(Suspended Account)',
  userName: '@username',
};

export const BaseProfileSearchCard = TemplateSearch.bind({});

BaseProfileSearchCard.args = {
  postsLabel: postsLabel,
  profileAnchorLink: '/profile',
  profileData: profileData,
};

export const BaseProfileMiniCard = TemplateMini.bind({});

BaseProfileMiniCard.args = {
  profileData: profileData,
};
