import React from 'react';
import { Box, Grommet } from 'grommet';

import ProfileCard, { IProfileCardProps } from '.';
import { ProfileSearchCard } from './profile-search-card';
import { ProfileWidgetCard, IProfileWidgetCard } from './profile-widget-card';
import { ProfileMiniCard, IProfileMiniCard } from './profile-mini-card';

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

const TemplateSearch = (args: IProfileWidgetCard) => (
  <Grommet theme={lightTheme}>
    <Box align="center" width="50%" pad={{ top: '40px' }}>
      <ProfileSearchCard {...args} />
    </Box>
  </Grommet>
);

const TemplateWidget = (args: IProfileWidgetCard) => (
  <Grommet theme={lightTheme}>
    <Box align="center" width="30%" pad={{ top: '40px' }}>
      <ProfileWidgetCard {...args} />
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

export const BaseProfileSearchCard = TemplateSearch.bind({});

BaseProfileSearchCard.args = {
  postsLabel: postsLabel,
  profileAnchorLink: '/profile',
  profileData: profileData,
};

export const BaseProfileWidgetCard = TemplateWidget.bind({});

BaseProfileWidgetCard.args = {
  profileData: profileData,
  descriptionLabel: aboutMeLabel,
  followingLabel: followingLabel,
  followersLabel: followersLabel,
  postsLabel: postsLabel,
  shareProfileLabel: shareProfileLabel,
};

export const BaseProfileMiniCard = TemplateMini.bind({});

BaseProfileMiniCard.args = {
  profileData: profileData,
};
