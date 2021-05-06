import React from 'react';
import { Box, Grommet } from 'grommet';

import TrendingWidgetCard from '.';

import lightTheme from '../../styles/themes/light/light-theme';
import { trendingProfilesData, trendingTagsData } from '../../utils/dummy-data';

export default {
  title: 'Cards/TrendingWidgetCard',
  component: TrendingWidgetCard,
  argType: {
    onClickProfile: { action: 'clicked profile' },
    onClickTag: { action: 'clicked tag' },
    handleFollowProfile: { action: 'clicked follow profile' },
    handleUnfollowProfile: { action: 'clicked unfollow profile' },
    handleSubscribeTag: { action: 'clicked subscribe tag' },
    handleUnsubscribeTag: { action: 'clicked unsubscribe tag' },
  },
};

const Template = (args: any) => (
  <Grommet theme={lightTheme}>
    <Box width="30%" pad="none" align="center">
      <TrendingWidgetCard {...args} />
    </Box>
  </Grommet>
);

export const BaseTrendingWidgetCard = Template.bind({});

BaseTrendingWidgetCard.args = {
  titleLabel: 'Trending Right Now',
  topicsLabel: 'Topics',
  profilesLabel: 'Profiles',
  tagAnchorLink: '/social-app/tags',
  profileAnchorLink: '/profile',
  tags: trendingTagsData,
  profiles: trendingProfilesData,
  followedProfiles: [],
  subscribedTags: [],
};
