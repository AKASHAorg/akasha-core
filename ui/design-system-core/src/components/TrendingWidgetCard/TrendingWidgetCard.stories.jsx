import React from 'react';
import TrendingWidgetCard from '.';

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

const Template = args => (
  <div style={{ width: '30%' }}>
    <TrendingWidgetCard {...args} />
  </div>
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
