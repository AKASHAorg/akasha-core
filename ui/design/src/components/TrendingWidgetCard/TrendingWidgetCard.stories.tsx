import React from 'react';
import { Box, Grommet } from 'grommet';
import TrendingWidgetCard, { ITrendingWidgetCardProps } from '.';

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
  decorators: [],
};

const Template = (args: ITrendingWidgetCardProps) => (
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
  tagAnchorLink: '/@akashaorg/app-akasha-integration/tags',
  profileAnchorLink: '/@akashaorg/app-profile',
  tags: trendingTagsData,
  profiles: trendingProfilesData,
  followedProfiles: [],
  subscribedTags: [],
};

BaseTrendingWidgetCard.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/eI5afUtDh3y2Fg8SLYCR2X/%F0%9F%9F%A1-Updated-Design-System?node-id=752%3A6562',
  },
};
